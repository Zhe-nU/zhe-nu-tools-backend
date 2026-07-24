import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from './base.model';
import { ScheduleItem } from './scheduleItem.model';
import { User } from './user.model';

@Table({ tableName: 'schedule' })
export class Schedule extends BaseModel {
  @ForeignKey(() => User)
  @Column
  declare userId: string;

  @BelongsTo(() => User)
  declare user: User;

  @Column declare name: string;

  @HasMany(() => ScheduleItem)
  declare items: ScheduleItem[];
}
