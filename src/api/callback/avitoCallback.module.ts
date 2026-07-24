import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AvitoCallbackService } from './avitoCallback.service';
import { AvitoCallbackController } from './avitoCallback.controller';
import { AvitoAPIModule } from 'src/lib/avitoAPI/avitoAPI.module';
import { AvitoUser } from 'src/models/avitoUser.model';
import { AvitoSession } from 'src/models/avitoSession.model';
import { User } from 'src/models/user.model';
import { Bot } from 'src/models/bot.model';
import { Schedule } from 'src/models/schedule.model';
import { ScheduleItem } from 'src/models/scheduleItem.model';

@Module({
  imports: [
    AvitoAPIModule,
    SequelizeModule.forFeature([
      AvitoUser,
      AvitoSession,
      Bot,
      Schedule,
      ScheduleItem,
      User,
    ]),
  ],
  controllers: [AvitoCallbackController],
  providers: [AvitoCallbackService],
})
export class AvitoCallbackModule {}
