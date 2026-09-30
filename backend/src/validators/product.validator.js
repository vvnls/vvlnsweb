import { z } from 'zod';

const variant = z
  .object({
    label: z.string().trim().min(1, 'Variant label is required').max(30),
    sku: z.string().trim().max(40).optional(),
    price: z.coerce.number().min(0, 'Price cannot be negative'),
    mrp: z.coerce.number().min(0).optional(),
    stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  })
  .refine((v) => v.mrp === undefined || v.mrp >= v.price, {
    message: 'MRP cannot be less than the price',
    path: ['mrp'],
  });

const body = z.object({
  title: z.string().trim().min(2, 'Title is too short').max(150),
  category: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid category'),
  shortDescription: z.string().trim().max(300).optional(),
  description: z.string().trim().max(5000).optional(),
  images: z.array(z.object({ url: z.string().url(), publicId: z.string().optional() })).max(8),
  variants: z.array(variant).min(1, 'Add at least one variant').max(10),
  tags: z.array(z.string().trim().toLowerCase().max(30)).max(15),
  hsnCode: z.string().trim().max(20).optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  seo: z.object({
    metaTitle: z.string().trim().max(70).optional(),
    metaDescription: z.string().trim().max(160).optional(),
  }),
});

// on create, only title, category and variants are required
export const createProductSchema = z.object({
  body: body.partial().required({ title: true, category: true, variants: true }),
});
export const updateProductSchema = z.object({ body: body.partial() });