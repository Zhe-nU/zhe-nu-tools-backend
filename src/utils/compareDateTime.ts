import dayjs from '../lib/dayjs';
import { WeekDay } from 'src/models/scheduleItem.model';

export interface Time {
  hours: number;
  minutes: number;
}

export interface Interval {
  startTime: Time;
  endTime: Time;
}

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

export function hasOverlappingIntervals(intervals: Interval[]): boolean {
  const converted = intervals.map(({ startTime, endTime }) => ({
    start: startTime.hours * 60 + startTime.minutes,
    end: endTime.hours * 60 + endTime.minutes,
  }));

  converted.sort((a, b) => a.start - b.start);

  for (let i = 1; i < converted.length; i++) {
    if (converted[i].start < converted[i - 1].end) {
      return true;
    }
  }

  return false;
}
