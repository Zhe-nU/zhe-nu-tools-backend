import {
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({ paranoid: true })
export class BaseModel extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @CreatedAt declare createdAt: Date;

  @UpdatedAt declare updatedAt: Date;

  @DeletedAt declare deletedAt: Date;
}
