import { Module } from '@nestjs/common';
import { BotModule } from './bot/bot.module';
import { AvitoCallbackModule } from './callback/avitoCallback.module';
import { WebhookModule } from './webhook/webhook.module';
import { AvitoSessionModule } from '../lib/avitoSession/avitoSession.module';
import { RouterModule } from '@nestjs/core';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [
    AvitoCallbackModule,
    AvitoSessionModule,
    BotModule,
    ScheduleModule,
    WebhookModule,

    RouterModule.register([
      {
        path: 'api',
        module: AvitoCallbackModule,
      },
      {
        path: 'api',
        module: BotModule,
      },
      {
        path: 'api',
        module: ScheduleModule,
      },
      {
        path: 'api',
        module: WebhookModule,
      },
    ]),
  ],
})
export class ApiModule {}
