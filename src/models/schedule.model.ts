import {
  BelongsTo,
  BelongsToMany,
  Column,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from './base.model';
import { ScheduleItem } from './scheduleItem.model';
import { User } from './user.model';
import { Bot } from './bot.model';
import { BotSchedule } from './botSchedule.model';

@Table({ tableName: 'schedule' })
export class Schedule extends BaseModel {
  @ForeignKey(() => User)
  @Column
  declare userId: string;

  @BelongsTo(() => User)
  declare user: User;

  @Column declare name: string;

  @BelongsToMany(() => Bot, () => BotSchedule)
  declare bots: Bot[];

  @HasMany(() => ScheduleItem)
  declare items: ScheduleItem[];
}
