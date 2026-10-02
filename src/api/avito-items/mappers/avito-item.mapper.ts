import { Injectable } from '@nestjs/common';
import { ApiAvitoItem } from '../dto/api-avito-items.dto';
import { AvitoItemEntity } from '../entities/avito-item.entity';
import { AvitoItemResponse } from '../dto/avito-item.response';

@Injectable()
export class AvitoItemMapper {
  toEntity(dto: ApiAvitoItem): AvitoItemEntity {
    return {
      id: '',
      avitoId: dto.id,
      title: dto.title,
      url: dto.url,
      status: dto.status,
      category: dto.category,
    };
  }

  toResponse(entity: AvitoItemEntity): AvitoItemResponse {
    return {
      id: entity.id,
      title: entity.title,
      url: entity.url,
      status: entity.status,
    };
  }
}
