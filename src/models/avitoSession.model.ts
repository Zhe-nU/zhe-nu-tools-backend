import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { AvitoUser } from './avitoUser.model';

@Table({ tableName: 'avito_session', paranoid: true, timestamps: true })
export class AvitoSession extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @ForeignKey(() => AvitoUser)
  @Column
  declare avitoUserId: string;

  @BelongsTo(() => AvitoUser)
  declare avitoUser: AvitoUser;

  @Column
  declare accessToken: string;

  @Column
  declare expiresIn: number;

  @Column
  declare refreshToken: string;

  @Column
  declare scope: string;

  @Column
  declare tokenType: string;
}
