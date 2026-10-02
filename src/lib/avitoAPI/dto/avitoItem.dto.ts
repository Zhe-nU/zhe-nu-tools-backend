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

export type ApiAvitoItem = z.infer<typeof apiAvitoItemSchema>;
