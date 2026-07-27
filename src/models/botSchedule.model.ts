import { Column, ForeignKey, Table } from 'sequelize-typescript';
import { BaseModel } from './base.model';
import { Bot } from './bot.model';
import { Schedule } from './schedule.model';

@Table({ tableName: 'bot_schedule' })
export class BotSchedule extends BaseModel {
  @ForeignKey(() => Bot)
  @Column
  declare botId: string;

  @ForeignKey(() => Schedule)
  @Column
  declare scheduleId: string;
}
