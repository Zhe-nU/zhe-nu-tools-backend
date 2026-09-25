import z from 'zod';

export const TimeDto = z
  .object({
    hours: z.int().min(0).max(23),
    minutes: z.int().min(0).max(59),
  })
  .meta({
    description: 'Объект с данными о времени',
  });

export const TimeStringDto = z
  .string()
  .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
  .meta({ description: 'Строка времени в формате [HH:mm]' });
