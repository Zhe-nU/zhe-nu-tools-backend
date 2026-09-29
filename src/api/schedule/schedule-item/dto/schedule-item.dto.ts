import dayjs from 'dayjs';
import { createZodDto } from 'nestjs-zod';
import { weekDays } from 'src/models/scheduleItem.model';
import { TimeDto, TimeStringDto } from 'src/shared/dto/time.dto';
import z from 'zod';

export class ScheduleItemDto extends createZodDto(
  z.object({
    id: z.uuid(),
    weekDay: z.enum(weekDays),
    startTime: TimeStringDto.optional().meta({ deprecated: true }),
    endTime: TimeStringDto.optional().meta({ deprecated: true }),
    time: z
      .object({
        startTime: TimeDto,
        endTime: TimeDto,
      })
      .refine(
        (data) => {
          const start = data.startTime.hours * 60 + data.startTime.minutes;
          const end = data.endTime.hours * 60 + data.endTime.minutes;
          return start < end;
        },
        { message: 'endTime must be after startTime' },
      ),
    text: z.string().min(1),
  }),
  { codec: true },
) {}

export class ScheduleItemsDto extends createZodDto(
  z.array(ScheduleItemDto.schema),
  { codec: true },
) {}

export class CreateScheduleItemDto extends createZodDto(
  ScheduleItemDto.schema
    .omit({ id: true })
    .transform((data) => {
      if (data.endTime === undefined)
        data.endTime = dayjs()
          .hour(data.time.endTime.hours)
          .minute(data.time.endTime.minutes)
          .format('HH:mm');

      if (data.startTime === undefined)
        data.startTime = dayjs()
          .hour(data.time.startTime.hours)
          .minute(data.time.startTime.minutes)
          .format('HH:mm');

      return data;
    })
    .meta({
      title: 'CreateScheduleItemDto',
      description: 'Объект с данными для создания части расписания',
    }),
  { codec: true },
) {}

export class BulkCreateScheduleItemsDto extends createZodDto(
  z.object({ items: z.array(CreateScheduleItemDto.schema) }),
  { codec: true },
) {}

export class UpdateScheduleItemDto extends createZodDto(
  ScheduleItemDto.schema
    .partial()
    .extend({
      id: z.uuid(),
    })
    .transform((data) => {
      if (data.endTime === undefined)
        data.endTime = dayjs()
          .hour(data.time?.endTime.hours || 0)
          .minute(data.time?.endTime.minutes || 0)
          .format('HH:mm');

      if (data.startTime === undefined)
        data.startTime = dayjs()
          .hour(data.time?.startTime.hours || 0)
          .minute(data.time?.startTime.minutes || 0)
          .format('HH:mm');

      return data;
    })
    .meta({
      title: 'UpdateScheduleItemDto',
      description: 'Объект с данными для обновления части расписания',
    }),
  { codec: true },
) {}

export class BulkUpdateScheduleItemsDto extends createZodDto(
  z.object({ items: z.array(UpdateScheduleItemDto.schema) }),
  { codec: true },
) {}
