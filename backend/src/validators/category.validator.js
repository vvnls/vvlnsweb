import { z } from 'zod';

const body = z.object({
  name: z.string().trim().min(2).max(60),
  description: z.string().trim().max(300).optional(),
  image: z.object({ url: z.string().url(), publicId: z.string().optional() }).optional(),
  isActive: z.boolean(),
  sortOrder: z.coerce.number().int(),
});

export const createCategorySchema = z.object({ body: body.partial().required({ name: true }) });
export const updateCategorySchema = z.object({ body: body.partial() });