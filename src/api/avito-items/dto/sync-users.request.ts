import z from 'zod';

export const syncAvitoItemsSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(25),
});

export type SyncAvitoItemsRequest = z.infer<typeof syncAvitoItemsSchema>;
