import { Injectable, NotFoundException } from '@nestjs/common';
import { AvitoAPIService } from '../../lib/avitoAPI/avitoAPI.service';
import { AvitoSession } from '../../models/avitoSession.model';
import { InjectModel } from '@nestjs/sequelize';
import { AvitoUser } from '../../models/avitoUser.model';

@Injectable()
export class AvitoItemsService {
  constructor(
    @InjectModel(AvitoUser) private avitoUserModel: typeof AvitoUser,
    private readonly avitoApiService: AvitoAPIService,
  ) {}

  async getUserItems(
    userId: string,
    params?: {
      perPage?: number;
      page?: number;
      status?: 'active' | 'removed' | 'old' | 'blocked' | 'rejected';
      updatedAtFrom?: string;
      category?: number;
    },
  ) {
    const avitoUser = await this.avitoUserModel.findOne({ where: { userId } });
    if (!avitoUser) throw new NotFoundException();

    await this.avitoApiService.getUserItems(String(avitoUser.avitoId), params);
  }
}
