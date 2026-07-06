import { Injectable, NotFoundException } from '@nestjs/common';
import { AvitoWebhookPayloadDto } from './dto/avitoWebhookPayload.dto';
import { AvitoSessionService } from '../../lib/avitoSession/avitoSession.service';
import { AvitoAPIService } from 'src/lib/avitoAPI/avitoAPI.service';
import { BotService } from '../bot/bot.service';
import { AvitoUserService } from 'src/lib/avitoUser/avitoUser.service';
import dayjs from 'dayjs';
import replacePlaceholders from 'src/utils/replacePlaceholders';

@Injectable()
export class WebhookService {
  constructor(
    private readonly avitoApiService: AvitoAPIService,
    private readonly avitoSessionService: AvitoSessionService,
    private readonly avitoUserService: AvitoUserService,
    private readonly botService: BotService,
  ) {}

  async avito({ payload }: AvitoWebhookPayloadDto) {
    const user = await this.avitoUserService.getUserByAvitoId(
      payload.userId.toString(),
    );
    if (!user) throw new NotFoundException('USER_NOT_FOUND');

    const botSettings = await this.botService.getBotSettings(user.id);
    if (!botSettings) throw new NotFoundException('BOT_SETTINGS_NOT_FOUND');

    const avitoSession =
      await this.avitoSessionService.getAvitoSessionByAvitoUserId(
        payload.userId.toString(),
      );
    if (!avitoSession) throw new NotFoundException('AVITO_SESSION_NOT_FOUND');

    if (avitoSession.avitoUser.avitoId === payload.authorId) return;

    const messages = await this.avitoApiService.getChatMessages({
      chatId: payload.chatId,
      avitoId: payload.userId.toString(),
      params: { limit: 100 },
    });

    const hasAuthorMessages = messages.some(
      (m) => m.authorId === payload.authorId,
    );

    if (botSettings.answerOnFirstMessage && hasAuthorMessages) return;
    if (!botSettings.isActive) return;
    if (!botSettings.chatTypes.includes(payload.chatType)) return;

    const chatData = await this.avitoApiService.getChatData(
      payload.userId.toString(),
      payload.chatId,
    );
    const interlocutor = chatData.users.find((u) => u.id !== payload.userId);
    if (!interlocutor) throw new NotFoundException('AVITO_USER_NOT_FOUND');

    const template = botSettings.weekDayText.find((wdt) =>
      wdt.days.includes(dayjs().format('ddd').toLocaleLowerCase()),
    )?.text;
    if (!template) return;

    const replacedText = replacePlaceholders(template, {
      ИмяСобеседника: interlocutor.name,
    });

    this.avitoApiService.sendMessageToChat({
      avitoId: payload.userId.toString(),
      chatId: payload.chatId,
      text: replacedText,
    });
  }
}
