import z from 'zod';

export const avitoChatMessagesDto = z.object({
  messages: z.array(
    z
      .object({
        id: z.string(),
        author_id: z.number(),
        created: z.number(),
        content: z.object({
          text: z.string(),
        }),
        type: z.string(),
        direction: z.enum(['in', 'out']),
        isRead: z.boolean(),
        read: z.number().optional(),
      })
      .transform((data) => ({
        id: data.id,
        authorId: data.author_id,
        created: data.created,
        content: data.content,
        type: data.type,
        direction: data.direction,
        isRead: data.isRead,
        read: data.read,
      })),
  ),
  meta: z
    .object({
      has_more: z.boolean(),
    })
    .transform((data) => ({ hasMore: data.has_more })),
});

export type AvitoChatMessagesDto = z.infer<typeof avitoChatMessagesDto>;
