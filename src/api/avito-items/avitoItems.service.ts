import { Injectable, NotFoundException } from '@nestjs/common';
import { AvitoAPIService } from '../../lib/avitoAPI/avitoAPI.service';
import { InjectModel } from '@nestjs/sequelize';
import { AvitoUser } from '../../models/avitoUser.model';

@Injectable()
export class AvitoItemsService {
  constructor(
    @InjectModel(AvitoUser) private avitoUserModel: typeof AvitoUser,
    private readonly avitoApiService: AvitoAPIService,
  ) {}

  async getUserItems(userId: string) {
    const avitoUser = await this.avitoUserModel.findOne({ where: { userId } });
    if (!avitoUser) throw new NotFoundException();

    const items = await this.avitoApiService.getUserItems(
      String(avitoUser.avitoId),
      {},
    );

    return items;
  }
}
