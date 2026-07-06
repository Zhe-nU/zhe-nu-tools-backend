import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table({ tableName: 'bot', timestamps: false })
export class Bot extends Model {
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
}
