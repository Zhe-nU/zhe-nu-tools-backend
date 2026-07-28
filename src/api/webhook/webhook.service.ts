import { Injectable, NotFoundException } from '@nestjs/common';
import dayjs from '../../lib/dayjs';
import { AvitoSessionService } from '../../lib/avitoSession/avitoSession.service';
import { AvitoAPIService } from 'src/lib/avitoAPI/avitoAPI.service';
import { BotService } from '../bot/bot.service';
import { AvitoUserService } from 'src/lib/avitoUser/avitoUser.service';
import replacePlaceholders from 'src/utils/replacePlaceholders';
import { isHourTimeBetween, isNowWeekDay } from 'src/utils/compareDateTime';
import { AvitoWebhookDto } from './dto/avitoWebhook.dto';

@Injectable()
export class WebhookService {
  constructor(
    private readonly avitoApiService: AvitoAPIService,
    private readonly avitoSessionService: AvitoSessionService,
    private readonly avitoUserService: AvitoUserService,
    private readonly botService: BotService,
  ) {}

  async avito({ payload }: AvitoWebhookDto) {
    const user = await this.avitoUserService.getUserByAvitoId(
      payload.value.userId.toString(),
    );
    if (!user) throw new NotFoundException('USER_NOT_FOUND');

    const bot = await this.botService.getBot(user.id);
    if (!bot) throw new NotFoundException('BOT_NOT_FOUND');

    const botSettings = await this.botService.getBotSettings(bot.id);
    if (!botSettings) throw new NotFoundException('BOT_SETTINGS_NOT_FOUND');

    const botSchedules = await this.botService.getBotSchedules(bot.id);

    const avitoSession =
      await this.avitoSessionService.getAvitoSessionByAvitoUserId(
        payload.value.userId.toString(),
      );
    if (!avitoSession) throw new NotFoundException('AVITO_SESSION_NOT_FOUND');

    if (avitoSession.avitoUser.avitoId === payload.value.authorId) return;

    const messages = await this.avitoApiService.getChatMessages({
      chatId: payload.value.chatId,
      avitoId: payload.value.userId.toString(),
      params: { limit: 100 },
    });

    const hasAuthorMessages = messages.some(
      (m) => m.authorId === payload.value.authorId,
    );

    if (botSettings.answerOnFirstMessage && hasAuthorMessages) return;
    if (!botSettings.isActive) return;
    if (!botSettings.chatTypes.includes(payload.value.chatType)) return;

    const chatData = await this.avitoApiService.getChatData(
      payload.value.userId.toString(),
      payload.value.chatId,
    );
    const interlocutor = chatData.users.find(
      (u) => u.id !== payload.value.userId,
    );
    if (!interlocutor) throw new NotFoundException('AVITO_USER_NOT_FOUND');

    const template = botSchedules
      .map((s) => s.items)
      .flat()
      .find(
        (i) =>
          isNowWeekDay(i.weekDay) &&
          isHourTimeBetween(i.startTime, i.endTime, dayjs().format('HH:mm')),
      )?.text;
    if (!template) return;

    const replacedText = replacePlaceholders(template, {
      ИмяСобеседника: interlocutor.name,
    });

    await this.avitoApiService.sendMessageToChat({
      avitoId: payload.value.userId.toString(),
      chatId: payload.value.chatId,
      text: replacedText,
    });
  }
}
