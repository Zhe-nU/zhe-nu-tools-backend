import {
  BeforeCreate,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { User } from './user.model';
import { BaseModel } from './base.model';
import { Schedule } from './schedule.model';
import { BotSchedule } from './botSchedule.model';

@Table({ tableName: 'bot' })
export class Bot extends BaseModel {
  @ForeignKey(() => User)
  @Column
  declare userId: string;

  @BelongsTo(() => User)
  declare user: User;

  @Column({
    type: DataType.JSONB,
  })
  declare settings: {
    answerOnFirstMessage: boolean;
    chatTypes: string[];
    isActive: boolean;
  };

  @BelongsToMany(() => Schedule, () => BotSchedule)
  declare schedules: Schedule[];

  @BeforeCreate
  static settingsDefault(instance: Bot) {
    const defaults = {
      answerOnFirstMessage: true,
      chatTypes: [],
      isActive: false,
    };

    instance.settings = {
      ...defaults,
      ...instance.settings,
    };
  }
}
