import {
  Table,
  Column,
  Model,
  HasOne,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import { AvitoUser } from './avitoUser.model';
import { Schedule } from './schedule.model';

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

  @HasMany(() => Schedule)
  declare schedules: Schedule[];
}
