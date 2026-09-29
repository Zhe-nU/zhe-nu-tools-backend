import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export class BotSettingsDto extends createZodDto(
  z
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
      id: 'BotSettings',
      description: 'Объект с настройками бота',
    }),
  { codec: true },
) {}

export class UpdateBotSettingsDto extends createZodDto(
  BotSettingsDto.schema.partial().meta({
    id: 'UpdateBotSettings',
    description: 'Объект с данными для обновления настроек бота',
  }),
  { codec: true },
) {}
