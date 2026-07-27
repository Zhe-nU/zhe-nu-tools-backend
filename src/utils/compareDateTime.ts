import dayjs from 'dayjs';
import { WeekDay } from 'src/models/scheduleItem.model';

export const isHourTimeBetween = (
  startTime: string,
  endTime: string,
  comparisonTime: string,
) => {
  return (
    dayjs(startTime, 'HH:mm').isBefore(comparisonTime) &&
    dayjs(endTime, 'HH:mm').isAfter(comparisonTime)
  );
};

export const isNowWeekDay = (weekDay: WeekDay) => {
  return dayjs().format('ddd').toLocaleLowerCase() === weekDay;
};
