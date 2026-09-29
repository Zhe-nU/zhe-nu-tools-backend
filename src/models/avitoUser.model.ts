import {
  BelongsTo,
  Column,
  ForeignKey,
  HasOne,
  Table,
} from 'sequelize-typescript';
import { AvitoSession } from './avitoSession.model';
import { User } from './user.model';
import { BaseModel } from './base.model';
import { Bot } from './bot.model';

@Table({ tableName: 'avito_user', paranoid: true, timestamps: true })
export class AvitoUser extends BaseModel {
  @ForeignKey(() => User)
  @Column
  declare userId: string;

  @BelongsTo(() => User)
  declare user: User;

  @Column
  declare avitoId: number;

  @Column
  declare name: string;

  @Column
  declare email: string;

  @Column
  declare phone: string;

  @Column
  declare profileUrl: string;

  @HasOne(() => Bot)
  declare bot: Bot;

  @HasOne(() => AvitoSession)
  declare avitoSession: AvitoSession;
}
