import z from 'zod';

export const avitoWebhookPayloadSchema = z.object({
  id: z.string(),
  version: z.string(),
  timestamp: z.number(),
  payload: z
    .object({
      id: z.string(),
      chat_id: z.string(),
      user_id: z.number(),
      author_id: z.number(),
      created: z.number(),
      type: z.enum(['message']),
      chat_type: z.enum(['u2u', 'u2i']),
      content: z.any(),
      item_id: z.number(),
    })
    .transform((data) => ({
      id: data.id,
      chatId: data.chat_id,
      userId: data.user_id,
      authorId: data.author_id,
      created: data.created,
      type: data.type,
      chatType: data.chat_type,
      content: data.content,
      itemId: data.item_id,
    })),
});

export type AvitoWebhookPayloadDto = z.infer<typeof avitoWebhookPayloadSchema>;
