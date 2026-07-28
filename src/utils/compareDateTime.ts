import dayjs from '../lib/dayjs';
import { WeekDay } from 'src/models/scheduleItem.model';

export const isHourTimeBetween = (
  startTime: string,
  endTime: string,
  comparisonTime: string,
) => {
  return (
    dayjs(startTime, 'HH:mm').isBefore(dayjs(comparisonTime, 'HH:mm')) &&
    dayjs(endTime, 'HH:mm').isAfter(dayjs(comparisonTime, 'HH:mm'))
  );
};

export const isNowWeekDay = (weekDay: WeekDay) => {
  return dayjs().format('ddd').toLocaleLowerCase() === weekDay;
};
