import { Module } from '@nestjs/common';
import { BotModule } from './bot/bot.module';
import { AvitoCallbackModule } from './callback/avitoCallback.module';
import { WebhookModule } from './webhook/webhook.module';
import { AvitoSessionModule } from '../lib/avitoSession/avitoSession.module';
import { RouterModule } from '@nestjs/core';
import { ScheduleModule } from './schedule/schedule.module';
import { ScheduleItemModule } from './schedule/schedule-item/schedule-item.module';

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
        children: [
          {
            path: 'callback/avito',
            module: AvitoCallbackModule,
          },
          {
            path: 'users',
            children: [
              {
                path: ':userId/bots',
                module: BotModule,
              },
              {
                path: ':userId/schedules',
                module: ScheduleModule,
                children: [
                  {
                    path: ':scheduleId/items',
                    module: ScheduleItemModule,
                  },
                ],
              },
            ],
          },

          {
            path: 'webhook',
            module: WebhookModule,
          },
        ],
      },
    ]),
  ],
})
export class ApiModule {}
