import z from 'zod';

export const avitoItemResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string(),
  status: z.string(),
});

export type AvitoItemResponse = z.infer<typeof avitoItemResponseSchema>;
