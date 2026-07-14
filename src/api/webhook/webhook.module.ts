import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AvitoSession } from 'src/models/avitoSession.model';
import { AvitoSessionModule } from 'src/lib/avitoSession/avitoSession.module';
import { AvitoAPIModule } from 'src/lib/avitoAPI/avitoAPI.module';
import { BotModule } from '../bot/bot.module';
import { AvitoUserModule } from 'src/lib/avitoUser/avitoUser.module';

@Module({
  imports: [
    AvitoAPIModule,
    AvitoSessionModule,
    AvitoUserModule,
    BotModule,
    SequelizeModule.forFeature([AvitoSession]),
  ],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
