import { Module } from '@nestjs/common';
import { BotController } from './bot.controller';
import { BotService } from './bot.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Bot } from 'src/models/bot.model';

@Module({
  imports: [SequelizeModule.forFeature([Bot])],
  controllers: [BotController],
  providers: [BotService],
  exports: [BotService],
})
export class BotModule {}
