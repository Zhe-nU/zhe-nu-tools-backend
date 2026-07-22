import z from 'zod';

export const avitoWebhookPayloadSchema = z.object({
  id: z.string(),
  version: z.string(),
  timestamp: z.number(),
  payload: z.object({
    type: z.enum(['message']),
    value: z
      .object({
        id: z.string(),
        chat_id: z.string(),
        user_id: z.number(),
        author_id: z.number(),
        created: z.number(),
        chat_type: z.enum(['u2u', 'u2i']),
        content: z.any(),
        item_id: z.number().optional(),
      })
      .transform((data) => ({
        id: data.id,
        chatId: data.chat_id,
        userId: data.user_id,
        authorId: data.author_id,
        created: data.created,
        chatType: data.chat_type,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        content: data.content,
        itemId: data.item_id,
      })),
  }),
});

export type AvitoWebhookPayloadDto = z.infer<typeof avitoWebhookPayloadSchema>;
