import { z } from 'zod';

export const createBulkEnquirySchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Name is too short').max(80),
    businessName: z.string().trim().max(120).optional(),
    email: z.string().trim().toLowerCase().email('Enter a valid email'),
    phone: z.string().trim().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
    productInterest: z.string().trim().min(2, 'Tell us which product(s) you need').max(200),
    quantity: z.string().trim().min(1, 'Tell us the quantity you need').max(100),
    message: z.string().trim().max(1000).optional(),
  }),
});

export const updateBulkEnquirySchema = z.object({
  body: z.object({
    status: z.enum(['new', 'contacted', 'closed']),
    adminNote: z.string().trim().max(1000).optional(),
  }).partial(),
});