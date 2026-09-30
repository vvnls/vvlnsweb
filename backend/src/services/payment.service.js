import Razorpay from 'razorpay';
import crypto from 'crypto';
import { env } from '../config/env.js';

const enabled = Boolean(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET);
const instance = enabled ? new Razorpay({ key_id: env.RAZORPAY_KEY_ID, key_secret: env.RAZORPAY_KEY_SECRET }) : null;

export const razorpayEnabled = enabled;

export async function createRazorpayOrder(amountInRupees, receipt) {
  if (!instance) throw new Error('Razorpay is not configured');
  return instance.orders.create({ amount: Math.round(amountInRupees * 100), currency: 'INR', receipt });
}

export function verifySignature(orderId, paymentId, signature) {
  const expected = crypto.createHmac('sha256', env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`).digest('hex');
  return expected === signature;
}

export async function fetchRazorpayOrder(orderId) {
  if (!instance) throw new Error('Razorpay is not configured');
  return instance.orders.fetch(orderId);
}

export async function refundPayment(paymentId, amountInRupees) {
  if (!instance) throw new Error('Razorpay is not configured');
  return instance.payments.refund(paymentId, { amount: Math.round(amountInRupees * 100) });
}