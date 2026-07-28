import { createZodDto } from 'nestjs-zod';
import { weekDays } from 'src/models/scheduleItem.model';
import z from 'zod';

export class ScheduleDto extends createZodDto(
  z.object({
    id: z.uuid(),
    name: z.string(),
  }),
) {}

export class ScheduleWithItemsDto extends createZodDto(
  ScheduleDto.schema.extend({
    items: z.array(
      z.object({
        weekDay: z.enum(weekDays),
        startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
        endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
        text: z.string().min(1),
      }),
    ),
  }),
) {}

export class SchedulesWithItemsDto extends createZodDto(
  z.array(ScheduleWithItemsDto.schema),
) {}

export class CreateScheduleDto extends createZodDto(
  z.object({
    name: z.string().min(1),
    items: z
      .array(
        z.object({
          weekDay: z.enum(weekDays),
          startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
          endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
          text: z.string().min(1),
        }),
      )
      .optional(),
  }),
) {}

export class UpdateScheduleDto extends createZodDto(
  CreateScheduleDto.schema.partial(),
) {}
