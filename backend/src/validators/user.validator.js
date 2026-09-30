import { z } from 'zod';
import { password } from './auth.validator.js';

const phone = z.string().trim().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number');

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80),
    email: z.string().trim().toLowerCase().email('Enter a valid email'),
    password,
    phone: phone.optional(),
    role: z.enum(['customer', 'admin']).optional(),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80),
    phone,
    role: z.enum(['customer', 'admin']),
    isActive: z.boolean(),
    password,
  }).partial(),
});