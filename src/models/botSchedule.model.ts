import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { User } from './user.model';
import { BaseModel } from './base.model';
import { BotScheduleDay } from './botScheduleDay.model';

export type WeekDay = 'mon' & 'tue' & 'wed' & 'thu' & 'fri' & 'sat' & 'sun';

@Table({ tableName: 'bot_schedule', timestamps: false })
export class BotSchedule extends BaseModel {
  @ForeignKey(() => User)
  @Column
  declare userId: string;

  @BelongsTo(() => User)
  declare user: User;

  @Column({ defaultValue: true }) declare answerOnFirstMessage: boolean;

  @Column({ defaultValue: false }) declare isActive: boolean;

  @HasMany(() => BotScheduleDay)
  declare days: BotScheduleDay[];
}
