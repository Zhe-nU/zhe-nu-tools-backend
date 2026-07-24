import { weekDays } from 'src/models/scheduleItem.model';
import z from 'zod';

export const updateScheduleSchema = z.object({
  name: z.string().min(1).optional(),
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
});

export type UpdateScheduleDto = z.infer<typeof updateScheduleSchema>;
