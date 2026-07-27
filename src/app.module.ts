import { Module } from '@nestjs/common';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';
import { ApiModule } from './api/api.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { AvitoSession } from './models/avitoSession.model';
import { AvitoUser } from './models/avitoUser.model';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './lib/auth';
import { User } from './models/user.model';
import { ConfigModule } from '@nestjs/config';
import { Bot } from './models/bot.model';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { Schedule } from './models/schedule.model';
import { ScheduleItem } from './models/scheduleItem.model';
import { BotSchedule } from './models/botSchedule.model';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SentryModule.forRoot(),
    ApiModule,
    AuthModule.forRoot({ auth }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      models: [
        AvitoSession,
        AvitoUser,
        Bot,
        BotSchedule,
        Schedule,
        ScheduleItem,
        User,
      ],
    }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
  ],
})
export class AppModule {}
