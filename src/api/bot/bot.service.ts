import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Bot } from 'src/models/bot.model';
import { UpdateBotSettingsDto } from './dto/updateBotSettings.dto';
import { AvitoAPIService } from 'src/lib/avitoAPI/avitoAPI.service';
import { AvitoUser } from 'src/models/avitoUser.model';

@Injectable()
export class BotService {
  constructor(
    @InjectModel(AvitoUser) private avitoUserModel: typeof AvitoUser,
    @InjectModel(Bot) private botModel: typeof Bot,
    @Inject() private readonly avitoAPIService: AvitoAPIService,
  ) {}

  async deleteBot(userId: string) {
    const avitoUser = await this.avitoUserModel.findOne({ where: { userId } });
    if (!avitoUser) throw new NotFoundException('AVITO_USER_NOT_FOUND');

    await this.botModel.destroy({ where: { userId } });

    await this.avitoAPIService.unsubscribeWebhook(avitoUser.avitoId.toString());
  }

  async getBot(userId: string) {
    return await this.botModel.findOne({ where: { userId } });
  }

  async getBotSettings(userId: string) {
    const bot = await this.botModel.findOne({ where: { userId } });
    if (!bot) throw new NotFoundException('BOT_SETTINGS_NOT_FOUND');

    return bot?.settings;
  }

  async updateBotSettings(userId: string, settings: UpdateBotSettingsDto) {
    const [_, [bot]] = await this.botModel.update(
      { settings },
      { where: { userId }, returning: true },
    );

    return bot.settings;
  }
}
