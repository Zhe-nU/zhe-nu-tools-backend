import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export class BotDto extends createZodDto(
  z.object({
    id: z.uuid(),
    userId: z.uuid(),
  }),
) {}

export class BindScheduleDto extends createZodDto(
  z.object({
    scheduleId: z.uuid(),
  }),
) {}

export class UnbindScheduleDto extends createZodDto(BindScheduleDto.schema) {}
