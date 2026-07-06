import z from 'zod';

const avitoChatDataDto = z.object({
  context: z.object({
    type: z.string(),
    value: z.object({
      id: z.number(),
      images: z.object({
        count: z.number(),
        main: z.record(z.string(), z.string()),
      }),
      price_string: z.string(),
      status_id: z.number(),
      title: z.string(),
      url: z.string(),
      user_id: z.number(),
    }),
  }),
  created: z.number,
  id: z.string,
  last_message: z.object({
    author_id: z.number,
    content: z.object(),
    created: z.number(),
    direction: z.enum(['in', 'out']),
    id: z.string(),
    type: z.string(),
  }),
  updated: z.number(),
  users: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      public_user_profile: z.object({
        avatar: z.object({
          default: z
            .string()
            .default('https://www.avito.st/stub_avatars/_/14_256x256.png'),
          images: z.record(z.string(), z.string()),
        }),
        item_id: z.number(),
        url: z.string(),
        user_id: z.number(),
      }),
    }),
  ),
});

export type AvitoChatDataDto = z.infer<typeof avitoChatDataDto>;
