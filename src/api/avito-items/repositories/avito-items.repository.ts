import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AvitoItem } from 'src/models/avito-item.model';
import { AvitoItemEntity } from '../entities/avito-item.entity';

@Injectable()
export class AvitoItemRepository {
  constructor(
    @InjectModel(AvitoItem) private avitoItemModel: typeof AvitoItem,
  ) {}

  async createMany(items: AvitoItemEntity[]): Promise<AvitoItemEntity[]> {
    return this.avitoItemModel.bulkCreate(items, { returning: true });
  }
}
