import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Bot } from 'src/models/bot.model';
import { UpdateBotSettingsDto } from './dto/updateBotSettings.dto';
import { AvitoAPIService } from 'src/lib/avitoAPI/avitoAPI.service';
import { AvitoUser } from 'src/models/avitoUser.model';
import { BotSchedule } from 'src/models/botSchedule.model';
import { Schedule } from 'src/models/schedule.model';

@Injectable()
export class BotService {
  constructor(
    @InjectModel(AvitoUser) private avitoUserModel: typeof AvitoUser,
    @InjectModel(Bot) private botModel: typeof Bot,
    @InjectModel(BotSchedule)
    private readonly botScheduleModel: typeof BotSchedule,
    @InjectModel(Schedule) private readonly scheduleModel: typeof Schedule,
    @Inject() private readonly avitoAPIService: AvitoAPIService,
  ) {}

  async bindSchedule(botId: string, scheduleId: string) {
    await this.botScheduleModel.create({ botId, scheduleId });
  }

  async deleteBot(userId: string) {
    const avitoUser = await this.avitoUserModel.findOne({ where: { userId } });
    if (!avitoUser) throw new NotFoundException('AVITO_USER_NOT_FOUND');

    await this.botModel.destroy({ where: { userId } });

    await this.avitoAPIService.unsubscribeWebhook(avitoUser.avitoId.toString());
  }

  async getBot(userId: string) {
    return await this.botModel.findOne({ where: { userId } });
  }

  async getBotSchedules(botId: string) {
    return await this.scheduleModel.findAll({
      include: {
        model: BotSchedule,
        where: { botId },
      },
    });
  }

  async getBotSettings(userId: string) {
    const bot = await this.botModel.findOne({ where: { userId } });
    if (!bot) throw new NotFoundException('BOT_SETTINGS_NOT_FOUND');

    return bot?.settings;
  }

  async unbindSchedule(botId: string, scheduleId: string) {
    await this.botScheduleModel.destroy({ where: { botId, scheduleId } });
  }

  async updateBotSettings(userId: string, settings: UpdateBotSettingsDto) {
    const [, [bot]] = await this.botModel.update(
      { settings },
      { where: { userId }, returning: true },
    );

    return bot.settings;
  }
}
