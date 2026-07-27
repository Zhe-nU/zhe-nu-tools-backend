import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export class BotSettingsDto extends createZodDto(
  z
    .object({
      answerOnFirstMessage: z
        .boolean()
        .optional()
        .describe(
          'Флаг, который отвечает за необходимость ответа только на первое сообщение, отправленное пользователем в чате',
        ),
      chatTypes: z
        .array(z.enum(['u2i', 'u2u']))
        .optional()
        .describe('Типы чатов, на которые будет работать автоответ'),
      isActive: z.boolean().optional().describe('Флаг активности бота'),
      weekDayText: z
        .array(
          z.object({
            days: z
              .array(z.enum(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']))
              .describe('Массив с днями недели для расписания'),
            text: z.string(),
          }),
        )
        .optional()
        .describe(
          'Массив объектов с расписаниями автоответа по дням недели и часам',
        ),
    })
    .meta({
      id: 'BotSettings',
      description: 'Объект с настройками бота',
    }),
  { codec: true },
) {}

export class UpdateBotSettingsDto extends createZodDto(
  BotSettingsDto.schema.meta({
    id: 'UpdateBotSettings',
    description: 'Объект с данными для обновления настроек бота',
  }),
  { codec: true },
) {}
