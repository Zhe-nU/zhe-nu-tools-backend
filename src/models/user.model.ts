import { Table, Column, Model, HasOne, DataType } from 'sequelize-typescript';
import { AvitoUser } from './avitoUser.model';

@Table({
  tableName: 'user',
  timestamps: false,
})
export class User extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column
  declare email: string;

  @Column
  declare name: string;

  @Column
  declare image: string;

  @HasOne(() => AvitoUser)
  declare avitoAccount: AvitoUser;
}
