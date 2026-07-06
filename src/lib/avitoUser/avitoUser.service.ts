import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AvitoUser } from 'src/models/avitoUser.model';
import { User } from 'src/models/user.model';

@Injectable()
export class AvitoUserService {
  constructor(
    @InjectModel(AvitoUser) private avitoUserModel: typeof AvitoUser,
    @InjectModel(User) private userModel: typeof User,
  ) {}

  getAvitoUser(avitoId: string) {
    return this.avitoUserModel.findOne({ where: { avitoId } });
  }

  getUserByAvitoId(avitoId: string) {
    return this.userModel.findOne({
      include: [
        {
          model: AvitoUser,
          where: {
            avitoId,
          },
          required: true,
        },
      ],
    });
  }
}
