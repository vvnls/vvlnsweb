import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

const transporter = env.EMAIL_HOST
  ? nodemailer.createTransport({
      host: env.EMAIL_HOST,
      port: env.EMAIL_PORT,
      secure: env.EMAIL_PORT === 465,
      auth: { user: env.EMAIL_USER, pass: env.EMAIL_PASS },
    })
  : null;

export async function sendEmail({ to, subject, html }) {
  if (!transporter) {
    console.log(`[email disabled] Would send to ${to}: ${subject}`);
    return;
  }
  await transporter.sendMail({ from: env.EMAIL_FROM, to, subject, html });
}

export const sendPasswordResetEmail = (to, resetUrl) =>
  sendEmail({
    to,
    subject: 'Reset your Vedvisha Naturals password',
    html: `<p>Click the link below to reset your password. This link expires in 30 minutes.</p>
           <p><a href="${resetUrl}">${resetUrl}</a></p>
           <p>If you didn't request this, you can safely ignore this email.</p>`,
  });

export const sendOrderConfirmationEmail = (to, order) =>
  sendEmail({
    to,
    subject: `Order confirmed — #${order._id.toString().slice(-8).toUpperCase()}`,
    html: `<p>Thank you for your order!</p>
           <p><b>Order:</b> #${order._id.toString().slice(-8).toUpperCase()}<br>
           <b>Total:</b> ₹${order.total}<br>
           <b>Payment method:</b> ${order.paymentMethod.toUpperCase()}</p>
           <p>We'll notify you again once it ships.</p>`,
  });

  export const sendBulkEnquiryNotification = (enquiry) =>
  sendEmail({
    to: env.EMAIL_FROM?.match(/<(.+)>/)?.[1] || env.EMAIL_USER, // sends to your own store inbox
    subject: `New bulk order enquiry from ${enquiry.name}`,
    html: `<p><b>Name:</b> ${enquiry.name}<br>
           <b>Business:</b> ${enquiry.businessName || '—'}<br>
           <b>Email:</b> ${enquiry.email}<br>
           <b>Phone:</b> ${enquiry.phone}<br>
           <b>Product(s):</b> ${enquiry.productInterest}<br>
           <b>Quantity:</b> ${enquiry.quantity}</p>
           <p><b>Message:</b><br>${enquiry.message || '—'}</p>
           <p>View it in the admin panel under Bulk Enquiries.</p>`,
  });