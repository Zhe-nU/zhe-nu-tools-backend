import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { AvitoSession } from './avitoSession.model';
import { User } from './user.model';

@Table({ tableName: 'avito_user', paranoid: true, timestamps: true })
export class AvitoUser extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

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

  @HasOne(() => AvitoSession)
  declare avitoSession: AvitoSession;
}
