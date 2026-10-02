import z from 'zod';

export const apiAvitoItemSchema = z.object({
  address: z.string(),
  category: z.object({
    id: z.number(),
    name: z.string(),
  }),
  id: z.number(),
  price: z.number(),
  status: z.string(),
  title: z.string(),
  url: z.string(),
});

export const apiAvitoItemsResponseSchema = z.object({
  meta: z.object({
    page: z.number(),
    per_page: z.number(),
  }),
  resources: z.array(apiAvitoItemSchema),
});

export type ApiAvitoItem = z.infer<typeof apiAvitoItemSchema>;
export type ApiAvitoItemResponse = z.infer<typeof apiAvitoItemsResponseSchema>;
