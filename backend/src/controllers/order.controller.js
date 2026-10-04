import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import AppError from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createRazorpayOrder, fetchRazorpayOrder, verifySignature, razorpayEnabled, refundPayment } from '../services/payment.service.js';
import { paging } from '../utils/query.js';
import { env } from '../config/env.js';
import { sendOrderConfirmationEmail } from '../services/email.services.js';
import { resolveTrackingUrl } from '../utils/couriers.js';
import { nextInvoiceNumber } from '../utils/invoiceNumber.js';
import { streamInvoicePDF } from '../services/invoice.services.js';

const FREE_SHIPPING_THRESHOLD = 299;
const SHIPPING_FEE = 70;
const COD_CHARGE = 30;

async function buildOrderItems(items) {
  const built = [];
  for (const { productId, variantLabel, qty } of items) {
    const product = await Product.findOne({ _id: productId, isActive: true, deletedAt: null });
    if (!product) throw new AppError('One of the products in your cart is no longer available', 400);
    const variant = product.variants.find((v) => v.label === variantLabel);
    if (!variant) throw new AppError(`Variant "${variantLabel}" not found for ${product.title}`, 400);
    if (variant.stock < qty) throw new AppError(`Only ${variant.stock} left in stock for ${product.title} (${variantLabel})`, 400);
    built.push({ product: product._id, title: product.title, variantLabel, hsnCode: product.hsnCode, price: variant.price, qty });
  }
  return built;
}

async function decrementStock(items, session) {
  for (const item of items) {
    const result = await Product.updateOne(
      { _id: item.product, 'variants.label': item.variantLabel, 'variants.stock': { $gte: item.qty } },
      { $inc: { 'variants.$.stock': -item.qty } },
      { session }
    );
    if (result.matchedCount === 0) throw new AppError(`${item.title} just went out of stock`, 409);
  }
}

const CUSTOMER_CANCELLABLE = ['placed'];
const ADMIN_CANCELLABLE = ['placed', 'packed'];
const TRANSITIONS = {
  placed: ['packed', 'cancelled'],
  packed: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

async function attemptRefund(order) {
  try {
    const refund = await refundPayment(order.razorpayPaymentId, order.total);
    order.refundId = refund.id;
    order.refundStatus = 'initiated';
    order.paymentStatus = 'refunded';
  } catch (err) {
    console.error('Refund failed:', err);
    order.refundStatus = 'failed'; // order stays cancelled; admin can retry from the order page
  }
  await order.save();
}

async function cancelOrder(orderId, { by, reason, allowedFrom, userFilter = {} }) {
  const session = await mongoose.startSession();
  let order = null;
  try {
    await session.withTransaction(async () => {
      // only one caller can flip a cancellable order, so stock is restored exactly once
      order = await Order.findOneAndUpdate(
        { _id: orderId, ...userFilter, status: { $in: allowedFrom } },
        {
          $set: { status: 'cancelled', cancelledAt: new Date(), cancelledBy: by, cancelReason: reason },
          $push: { statusHistory: { status: 'cancelled', at: new Date() } },
        },
        { new: true, session }
      );
      if (!order) return;
      for (const item of order.items) {
        await Product.updateOne(
          { _id: item.product, 'variants.label': item.variantLabel },
          { $inc: { 'variants.$.stock': item.qty } },
          { session }
        );
      }
    });
  } finally {
    session.endSession();
  }

  if (!order) throw new AppError('This order can no longer be cancelled', 409);
  if (order.paymentMethod === 'razorpay' && order.paymentStatus === 'paid') await attemptRefund(order);
  return order;
}

export const cancelMyOrder = asyncHandler(async (req, res) => {
  if (!(await Order.exists({ _id: req.params.id, user: req.user._id }))) throw new AppError('Order not found', 404);
  const order = await cancelOrder(req.params.id, {
    by: 'customer',
    reason: req.body.reason,
    allowedFrom: CUSTOMER_CANCELLABLE,
    userFilter: { user: req.user._id },
  });
  res.json({ status: 'success', order });
});

export const createOrder = asyncHandler(async (req, res) => {
  const { items: rawItems, shippingAddress, paymentMethod, email } = req.body;
  const items = await buildOrderItems(rawItems); // checks stock, doesn't touch it yet
  const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const codCharge = paymentMethod === 'cod' ? COD_CHARGE : 0;
  const total = subtotal + shippingFee + codCharge;

  if (paymentMethod === 'cod') {
    const invoiceNumber = await nextInvoiceNumber();
    const session = await mongoose.startSession();
    let order;
    await session.withTransaction(async () => {
      await decrementStock(items, session);
      [order] = await Order.create([{
        user: req.user?._id, guestEmail: req.user ? undefined : email,
        items, shippingAddress, subtotal, shippingFee, codCharge, total,
        paymentMethod, paymentStatus: 'pending', status: 'placed',
        invoiceNumber, invoiceDate: new Date(),
        statusHistory: [{ status: 'placed', at: new Date() }],
      }], { session });
    });
    session.endSession();
    sendOrderConfirmationEmail(req.user?.email || email, order).catch((e) => console.error('Email error:', e));
    return res.status(201).json({ status: 'success', order });
  }

  // razorpay: nothing is saved to the database yet. If the payment fails or the person closes the checkout window, no order row is ever created for it.
  if (!razorpayEnabled) throw new AppError('Online payment is not available right now. Please choose Cash on Delivery.', 400);
  const receipt = `rcpt_${req.user?._id || 'guest'}_${Date.now()}`;
  const rpOrder = await createRazorpayOrder(total, receipt);
  res.status(201).json({ status: 'success', razorpayOrderId: rpOrder.id, amount: rpOrder.amount, keyId: env.RAZORPAY_KEY_ID });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const { items: rawItems, shippingAddress, razorpay_order_id, razorpay_payment_id, razorpay_signature, email } = req.body;

  if (!verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
    throw new AppError('Payment verification failed', 400);
  }

  // re-check stock and prices at this exact moment — the cart may have gone stale while the payment was in progress
  const items = await buildOrderItems(rawItems);
  const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee; // codCharge is 0 for online payments

  // confirm the amount actually charged matches what we expect now, so a tampered request can't slip through
  const rpOrder = await fetchRazorpayOrder(razorpay_order_id);
  if (rpOrder.amount !== Math.round(total * 100)) {
    throw new AppError('Order amount mismatch. Please contact support before retrying.', 400);
  }

  const invoiceNumber = await nextInvoiceNumber();
  const session = await mongoose.startSession();
  let order;
  await session.withTransaction(async () => {
    await decrementStock(items, session);
        [order] = await Order.create([{
      user: req.user?._id, guestEmail: req.user ? undefined : email,
      items, shippingAddress, subtotal, shippingFee, codCharge: 0, total,
      paymentMethod: 'razorpay', paymentStatus: 'paid', status: 'placed',
      invoiceNumber, invoiceDate: new Date(),
      razorpayOrderId: razorpay_order_id, razorpayPaymentId: razorpay_payment_id,
      statusHistory: [{ status: 'placed', at: new Date() }],
    }], { session });
  });
  session.endSession();

  sendOrderConfirmationEmail(req.user?.email || email, order).catch((e) => console.error('Email error:', e));
  res.json({ status: 'success', order });
});

export const listMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
  res.json({ status: 'success', orders });
});

export const getMyOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!order) throw new AppError('Order not found', 404);
  res.json({ status: 'success', order });
});

// ---------- admin ----------
export const adminListOrders = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paging(req.query);
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.excludeStatus) filter.status = { $ne: req.query.excludeStatus };
  const [orders, total] = await Promise.all([
    Order.find(filter).populate('user', 'name email').sort('-createdAt').skip(skip).limit(limit),
    Order.countDocuments(filter),
  ]);
  res.json({ status: 'success', orders, page, pages: Math.ceil(total / limit), total });
});

export const adminGetOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) throw new AppError('Order not found', 404);
  res.json({ status: 'success', order });
});

export const adminUpdateOrderStatus = asyncHandler(async (req, res) => {
  const { status, trackingNumber, courier, trackingUrl, reason } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) throw new AppError('Order not found', 404);

  if (status === 'cancelled') {
    const cancelled = await cancelOrder(order._id, { by: 'admin', reason, allowedFrom: ADMIN_CANCELLABLE });
    return res.json({ status: 'success', order: cancelled });
  }

  const changing = status !== order.status;
  if (changing && !TRANSITIONS[order.status].includes(status)) {
    throw new AppError(`An order cannot move from ${order.status} to ${status}`, 400);
  }

  const set = { status };
  if (trackingNumber !== undefined) set.trackingNumber = trackingNumber;
  if (courier !== undefined) set.courier = courier;
  if (trackingUrl !== undefined) set.trackingUrl = trackingUrl;
  if (status === 'delivered' && order.paymentMethod === 'cod') set.paymentStatus = 'paid'; // cash collected

  const update = { $set: set };
  if (changing) update.$push = { statusHistory: { status, at: new Date() } };

  // the status filter makes this fail safely if a cancel or another update landed in between
  const updated = await Order.findOneAndUpdate({ _id: order._id, status: order.status }, update, { new: true });
  if (!updated) throw new AppError('This order was just updated elsewhere. Refresh and try again.', 409);
  res.json({ status: 'success', order: updated });
});

export const adminRetryRefund = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new AppError('Order not found', 404);
  if (order.status !== 'cancelled' || order.refundStatus !== 'failed') throw new AppError('There is no failed refund to retry', 400);
  await attemptRefund(order);
  res.json({ status: 'success', order });
});

// public: no login. The order number and the phone on the order must both match.
export const trackOrder = asyncHandler(async (req, res) => {
  const { orderCode, phone } = req.body;
  const candidates = await Order.find({ 'shippingAddress.phone': phone }).sort('-createdAt').limit(100);
  const order = candidates.find((o) => o._id.toString().slice(-8).toUpperCase() === orderCode);
  // same message for a wrong number or a wrong phone, so nobody can probe for valid orders
  if (!order) throw new AppError('We could not find an order with those details', 404);

  const history = order.statusHistory.map((h) => ({ status: h.status, at: h.at }));
  if (history[0]?.status !== 'placed') history.unshift({ status: 'placed', at: order.createdAt }); // older orders

  res.json({
    status: 'success',
    order: {
      orderCode,
      status: order.status,
      placedAt: order.createdAt,
      total: order.total,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      items: order.items.map((i) => ({ title: i.title, variantLabel: i.variantLabel, qty: i.qty })),
      city: order.shippingAddress.city,
      pincode: order.shippingAddress.pincode,
      courier: order.courier || null,
      trackingNumber: order.trackingNumber || null,
      trackingUrl: resolveTrackingUrl(order),
      history,
    },
  });
});

export const adminDownloadInvoice = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new AppError('Order not found', 404);

  if (!order.invoiceNumber) {
    order.invoiceNumber = await nextInvoiceNumber();
    order.invoiceDate = order.invoiceDate || order.createdAt;
    await order.save();
  }
  streamInvoicePDF(order, res);
});