import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Bot } from 'src/models/bot.model';
import { UpdateBotSettingsDto } from './dto/updateBotSettings.dto';

@Injectable()
export class BotService {
  constructor(@InjectModel(Bot) private botModel: typeof Bot) {}

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
