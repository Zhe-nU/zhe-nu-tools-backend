import { Module } from '@nestjs/common';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { ApiModule } from './api/api.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { AvitoSession } from './models/avitoSession.model';
import { AvitoUser } from './models/avitoUser.model';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './lib/auth';
import { User } from './models/user.model';
import { ConfigModule } from '@nestjs/config';
import { Bot } from './models/bot.model';
import { APP_FILTER } from '@nestjs/core';

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
      models: [AvitoSession, AvitoUser, Bot, User],
    }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
})
export class AppModule {}
