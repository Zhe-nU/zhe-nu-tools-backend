import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from './base.model';
import { AvitoUser } from './avitoUser.model';

@Table({ tableName: 'avito_item' })
export class AvitoItem extends BaseModel {
  @ForeignKey(() => AvitoUser)
  @Column
  declare avitoUserId: string;

  @BelongsTo(() => AvitoUser)
  declare avitoUser: AvitoUser;

  @Column
  declare avitoId: number;

  @Column
  declare title: string;

  @Column
  declare url: string;

  @Column
  declare status: string;

  @Column({
    type: DataType.JSONB,
  })
  declare category: {
    id: number;
    name: string;
  };
}
