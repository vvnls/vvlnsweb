import { z } from 'zod';

const address = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  line1: z.string().trim().min(4).max(200),
  line2: z.string().trim().max(200).optional(),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  pincode: z.string().trim().regex(/^\d{6}$/, 'Enter a valid 6-digit pincode'),
});

const items = z.array(z.object({
  productId: z.string().regex(/^[a-f\d]{24}$/i),
  variantLabel: z.string().min(1),
  qty: z.coerce.number().int().min(1).max(20),
})).min(1, 'Cart is empty');

export const createOrderSchema = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().email('Enter a valid email'),
    items,
    shippingAddress: address,
    paymentMethod: z.enum(['cod', 'razorpay']),
  }),
});

export const verifyPaymentSchema = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().email('Enter a valid email'),
    items,
    shippingAddress: address,
    razorpay_order_id: z.string(),
    razorpay_payment_id: z.string(),
    razorpay_signature: z.string(),
  }),
});
const trackingUrl = z.string().trim().max(300)
  .refine((u) => u === '' || /^https:\/\/\S+$/.test(u), 'Tracking link must start with https://');

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(['placed', 'packed', 'shipped', 'delivered', 'cancelled']),
    trackingNumber: z.string().trim().max(60).optional(),
    courier: z.string().trim().max(40).optional(),
    trackingUrl: trackingUrl.optional(),
    reason: z.string().trim().max(300).optional(),
  }),
});

export const trackOrderSchema = z.object({
  body: z.object({
    orderCode: z.string().trim().toUpperCase().regex(/^[A-F0-9]{8}$/, 'Enter the 8-character order number'),
    phone: z.string().trim().regex(/^[6-9]\d{9}$/, 'Enter the 10-digit mobile number used for the order'),
  }),
});

export const cancelOrderSchema = z.object({
  body: z.object({ reason: z.string().trim().max(300).optional() }),
});