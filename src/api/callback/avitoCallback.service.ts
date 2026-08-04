import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AvitoAPIService } from 'src/lib/avitoAPI/avitoAPI.service';
import { AvitoSession } from 'src/models/avitoSession.model';
import { AvitoUser } from 'src/models/avitoUser.model';
import { Bot } from 'src/models/bot.model';
import { User } from 'src/models/user.model';

@Injectable()
export class AvitoCallbackService {
  constructor(
    @InjectModel(AvitoUser) private avitoUserModel: typeof AvitoUser,
    @InjectModel(AvitoSession) private avitoSessionModel: typeof AvitoSession,
    @InjectModel(Bot) private botModel: typeof Bot,
    @InjectModel(User) private userModel: typeof User,
    private readonly avitoAPIService: AvitoAPIService,
  ) {}

  async oauthAvito(
    userId: string,
    code: string,
  ): Promise<{ success: boolean; reason?: string }> {
    const user = await this.userModel.findByPk(userId);
    if (!user) throw new NotFoundException('USER_NOT_FOUND');

    const tokenData = await this.avitoAPIService.getToken(code);
    const { accessToken } = tokenData;

    const avitoUserData = await this.avitoAPIService.getSelf(accessToken);

    let avitoUser = await this.avitoUserModel.findOne({ where: { userId } });

    if (!avitoUser) {
      avitoUser = await this.avitoUserModel.create({
        userId,
        ...avitoUserData,
      });

      await this.avitoSessionModel.create({
        ...tokenData,
        avitoUserId: avitoUser.id,
      });
    } else {
      const bot = await this.botModel.findOne({
        where: { avitoUserId: avitoUser.id },
      });
      if (bot)
        return {
          success: false,
          reason: 'BOT_ALREADY_LINKED',
        };

      await this.avitoSessionModel.update(tokenData, {
        where: { avitoUserId: avitoUser.id },
      });
    }

    await this.botModel.create({ userId, avitoUserId: avitoUser.id });

    await this.avitoAPIService.addWebhook(avitoUserData.avitoId.toString());

    return { success: true };
  }
}
