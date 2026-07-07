import z from 'zod';

export const updateBotSettingsSchema = z.object({
  answerOnFirstMessage: z.boolean().optional(),
  chatTypes: z.array(z.enum(['u2i', 'u2u'])).optional(),
  isActive: z.boolean().optional(),
  weekDayText: z
    .array(
      z.object({
        days: z.array(
          z.enum(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']),
        ),
        text: z.string(),
      }),
    )
    .optional(),
});

export type UpdateBotSettingsDto = z.infer<typeof updateBotSettingsSchema>;
