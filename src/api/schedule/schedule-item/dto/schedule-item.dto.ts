import { createZodDto } from 'nestjs-zod';
import { weekDays } from 'src/models/scheduleItem.model';
import z from 'zod';

export class ScheduleItemDto extends createZodDto(
  z.object({
    id: z.uuid(),
    weekDay: z.enum(weekDays),
    startTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .optional()
      .meta({ deprecated: true }),
    endTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .optional()
      .meta({ deprecated: true }),
    time: z
      .object({
        startTime: z.object({
          hours: z.int().min(0).max(23),
          minutes: z.int().min(0).max(59),
        }),
        endTime: z.object({
          hours: z.int().min(0).max(23),
          minutes: z.int().min(0).max(59),
        }),
      })
      .refine(
        (data) => {
          const start = data.startTime.hours * 60 + data.startTime.minutes;
          const end = data.endTime.hours * 60 + data.endTime.minutes;
          return start < end;
        },
        { message: 'endTime must be after startTime' },
      )
      .meta({
        description: 'Объект с временем начала и окончания в формате [HH, MM]',
      }),
    text: z.string().min(1),
  }),
  { codec: true },
) {}

export class ScheduleItemsDto extends createZodDto(
  z.array(ScheduleItemDto.schema),
  { codec: true },
) {}

export class CreateScheduleItemDto extends createZodDto(
  ScheduleItemDto.schema.omit({ id: true }),
  { codec: true },
) {}

export class UpdateScheduleItemDto extends createZodDto(
  CreateScheduleItemDto.schema.partial(),
  { codec: true },
) {}
