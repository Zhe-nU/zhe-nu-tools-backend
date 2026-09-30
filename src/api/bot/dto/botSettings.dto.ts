import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const botSettingsSchema = z
  .object({
    answerOnFirstMessage: z
      .boolean()
      .describe(
        'Флаг, который отвечает за необходимость ответа только на первое сообщение, отправленное пользователем в чате',
      ),
    chatTypes: z
      .array(z.enum(['u2i', 'u2u']))
      .describe('Типы чатов, на которые будет работать автоответ'),
    isActive: z.boolean().describe('Флаг активности бота'),
  })
  .meta({
    description: 'Объект с настройками бота',
  });

const updateBotSettingsSchema = botSettingsSchema.partial().meta({
  description: 'Объект с данными для обновления настроек бота',
});

export class BotSettingsDto extends createZodDto(botSettingsSchema, {
  codec: true,
}) {}

export class UpdateBotSettingsDto extends createZodDto(
  updateBotSettingsSchema,
  { codec: true },
) {}
