import { Module } from '@nestjs/common';
import { BotController } from './bot.controller';
import { BotService } from './bot.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Bot } from 'src/models/bot.model';
import { AvitoUser } from 'src/models/avitoUser.model';
import { AvitoAPIModule } from 'src/lib/avitoAPI/avitoAPI.module';

@Module({
  imports: [AvitoAPIModule, SequelizeModule.forFeature([AvitoUser, Bot])],
  controllers: [BotController],
  providers: [BotService],
  exports: [BotService],
})
export class BotModule {}
