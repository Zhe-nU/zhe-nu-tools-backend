import { BelongsTo, Column, ForeignKey, Table } from 'sequelize-typescript';
import { AvitoUser } from './avitoUser.model';
import { BaseModel } from './base.model';

@Table({ tableName: 'avito_session', paranoid: true })
export class AvitoSession extends BaseModel {
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
