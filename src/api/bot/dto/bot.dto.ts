import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export class BotDto extends createZodDto(
  z
    .object({
      id: z.uuid(),
      userId: z.uuid(),
    })
    .meta({ title: 'Бот', description: 'Объект с информацией о боте' }),
  { codec: true },
) {}

export class BindScheduleDto extends createZodDto(
  z.object({
    scheduleId: z.uuid(),
  }),
  { codec: true },
) {}

export class UnbindScheduleDto extends createZodDto(BindScheduleDto.schema) {}
