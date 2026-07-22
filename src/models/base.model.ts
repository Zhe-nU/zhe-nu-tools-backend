import {
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  Model,
  UpdatedAt,
} from 'sequelize-typescript';

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
