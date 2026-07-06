import { Table, Column, Model, DataType, HasOne } from 'sequelize-typescript';
import { AvitoUser } from './avitoUser.model';

@Table({
  tableName: 'user',
  timestamps: false,
})
export class User extends Model {
  @Column
  declare email: string;

  @Column
  declare name: string;

  @Column
  declare image: string;

  @HasOne(() => AvitoUser)
  declare avitoAccount: AvitoUser;
}
