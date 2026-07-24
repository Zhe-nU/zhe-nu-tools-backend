import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Schedule } from 'src/models/schedule.model';
import { ScheduleItem } from 'src/models/scheduleItem.model';

@Module({
  imports: [SequelizeModule.forFeature([Schedule, ScheduleItem])],
  controllers: [ScheduleController],
  providers: [ScheduleService],
})
export class ScheduleModule {}
