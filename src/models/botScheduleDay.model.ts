import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from './base.model';
import { BotSchedule, WeekDay } from './botSchedule.model';
import { TimeString } from 'src/types/time';

@Table({ tableName: 'bot_schedule_day' })
export class BotScheduleDay extends BaseModel {
  @ForeignKey(() => BotSchedule)
  @Column
  declare scheduleId?: number;

  @BelongsTo(() => BotSchedule)
  declare schedule: BotSchedule;

  @Column({ type: DataType.ARRAY(DataType.STRING) })
  declare weekDays: WeekDay[];

  @Column({ type: DataType.ARRAY(DataType.STRING) }) declare timeRange: [
    TimeString,
    TimeString,
  ];

  @Column declare text: string;
}
