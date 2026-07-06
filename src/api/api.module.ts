import { Module } from '@nestjs/common';
import { BotModule } from './bot/bot.module';
import { AvitoCallbackModule } from './callback/avitoCallback.module';
import { WebhookModule } from './webhook/webhook.module';
import { AvitoSessionModule } from '../lib/avitoSession/avitoSession.module';

@Module({
  imports: [AvitoCallbackModule, AvitoSessionModule, BotModule, WebhookModule],
})
export class ApiModule {}
