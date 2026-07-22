import {
  BeforeCreate,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { User } from './user.model';
import { BaseModel } from './base.model';

@Table({ tableName: 'bot', timestamps: false })
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
    weekDayText: Array<{ days: string[]; text: string }>;
  };

  @BeforeCreate
  static settingsDefault(instance: Bot) {
    const defaults = {
      answerOnFirstMessage: true,
      chatTypes: [],
      isActive: false,
      weekDayText: [],
    };

    instance.settings = {
      ...defaults,
      ...instance.settings,
    };
  }
}
