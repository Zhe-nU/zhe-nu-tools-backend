import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import { BaseModel } from './base.model';
import { Schedule } from './schedule.model';
import { type TimeString } from 'src/types/time';

export const weekDays = [
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat',
  'sun',
] as const;
export type WeekDay = (typeof weekDays)[number];

const SCHEDULE_DAY_UNIQUE_CONSTRAINT = 'schedule_day_time_unique';

@Table({ tableName: 'schedule_item' })
export class ScheduleItem extends BaseModel {
  @Unique(SCHEDULE_DAY_UNIQUE_CONSTRAINT)
  @ForeignKey(() => Schedule)
  @Column
  declare scheduleId: string;

  @BelongsTo(() => Schedule)
  declare schedule: Schedule;

  @Unique(SCHEDULE_DAY_UNIQUE_CONSTRAINT)
  @Column({ type: DataType.STRING })
  declare weekDay: WeekDay;

  @Unique(SCHEDULE_DAY_UNIQUE_CONSTRAINT)
  @Column({ type: DataType.STRING })
  declare startTime: TimeString;

  @Unique(SCHEDULE_DAY_UNIQUE_CONSTRAINT)
  @Column({ type: DataType.STRING })
  declare endTime: TimeString;

  @Column({
    type: DataType.JSONB,
    defaultValue: {
      startTime: { hours: 0, minutes: 0 },
      endTime: { hours: 23, minutes: 59 },
    },
  })
  declare time: {
    startTime: { hours: number; minutes: number };
    endTime: { hours: number; minutes: number };
  };

  @Column declare text: string;
}
