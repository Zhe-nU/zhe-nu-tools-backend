import { Module } from '@nestjs/common';
import { ScheduleItemController } from './schedule-item.controller';
import { ScheduleItemService } from './schedule-item.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ScheduleItem } from 'src/models/scheduleItem.model';

@Module({
  imports: [SequelizeModule.forFeature([ScheduleItem])],
  controllers: [ScheduleItemController],
  providers: [ScheduleItemService],
})
export class ScheduleItemModule {}
