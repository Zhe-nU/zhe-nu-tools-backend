import { createZodDto } from 'nestjs-zod';
import z from 'zod';
import { ScheduleItemDto } from '../schedule-item/dto/schedule-item.dto';

export class ScheduleDto extends createZodDto(
  z.object({
    id: z.uuid(),
    name: z.string().min(1),
    description: z.string().nullish(),
  }),
  { codec: true },
) {}

export class ScheduleWithItemsDto extends createZodDto(
  ScheduleDto.schema.extend({
    items: z.array(ScheduleItemDto.schema),
  }),
  { codec: true },
) {}

export class SchedulesWithItemsDto extends createZodDto(
  z.array(ScheduleWithItemsDto.schema),
  { codec: true },
) {}

export class CreateScheduleDto extends createZodDto(
  z.object({
    name: z.string().min(1),
    description: z.string().optional(),
  }),
  { codec: true },
) {}

export class UpdateScheduleDto extends createZodDto(
  CreateScheduleDto.schema.partial(),
  { codec: true },
) {}
