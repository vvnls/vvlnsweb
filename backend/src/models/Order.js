import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  phone: { type: String, required: true, trim: true },
  line1: { type: String, required: true, trim: true, maxlength: 200 },
  line2: { type: String, trim: true, maxlength: 200 },
  city: { type: String, required: true, trim: true, maxlength: 80 },
  state: { type: String, required: true, trim: true, maxlength: 80 },
  pincode: { type: String, required: true, trim: true },
}, { _id: false });

const itemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  title: { type: String, required: true },
  variantLabel: { type: String, required: true },
  hsnCode: String,
  price: { type: Number, required: true },
  qty: { type: Number, required: true, min: 1 },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  guestEmail: { type: String, trim: true, lowercase: true },
  items: { type: [itemSchema], validate: [(v) => v.length > 0, 'Order must have at least one item'] },
  shippingAddress: { type: addressSchema, required: true },
  subtotal: { type: Number, required: true },
  shippingFee: { type: Number, required: true, default: 0 },
  codCharge: { type: Number, required: true, default: 0 },
  invoiceNumber: String,
  invoiceDate: Date,
  total: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['cod', 'razorpay'], required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  status: { type: String, enum: ['placed', 'packed', 'shipped', 'delivered', 'cancelled'], default: 'placed' },
  trackingNumber: String,
    courier: { type: String, trim: true, maxlength: 40 },
  trackingUrl: { type: String, trim: true, maxlength: 300 },
  statusHistory: [{ _id: false, status: String, at: Date }],
    cancelledAt: Date,
  cancelledBy: { type: String, enum: ['customer', 'admin'] },
  cancelReason: { type: String, maxlength: 300 },
  refundId: String,
  refundStatus: { type: String, enum: ['none', 'initiated', 'failed'], default: 'none' },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);