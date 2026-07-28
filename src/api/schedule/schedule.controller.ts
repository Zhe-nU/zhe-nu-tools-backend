import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { Schedule } from 'src/models/schedule.model';
import {
  CreateScheduleDto,
  ScheduleDto,
  SchedulesWithItemsDto,
  ScheduleWithItemsDto,
  UpdateScheduleDto,
} from './dto/schedule.dto';
import { ZodResponse } from 'nestjs-zod';

@Controller('user/:userId/schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  @ZodResponse({ status: 201, type: ScheduleDto })
  async createSchedule(
    @Param() { userId }: { userId: string },
    @Body()
    createScheduleDto: CreateScheduleDto,
  ): Promise<Schedule> {
    return this.scheduleService.createSchedule(userId, createScheduleDto);
  }

  @Get()
  @ZodResponse({ status: 200, type: SchedulesWithItemsDto })
  userScheduleList(
    @Param() { userId }: { userId: string },
  ): Promise<Schedule[]> {
    return this.scheduleService.userScheduleList(userId);
  }

  @Get(':scheduleId')
  @ZodResponse({ status: 200, type: ScheduleWithItemsDto })
  getSchedule(
    @Param() { scheduleId }: { scheduleId: string },
  ): Promise<Schedule> {
    return this.scheduleService.getSchedule(scheduleId);
  }

  @Patch(':scheduleId')
  @ZodResponse({ status: 200, type: ScheduleWithItemsDto })
  updateSchedule(
    @Param() { scheduleId }: { scheduleId: string },
    @Body()
    updateScheduleDto: UpdateScheduleDto,
  ): Promise<Schedule> {
    return this.scheduleService.updateSchedule(scheduleId, updateScheduleDto);
  }

  @Delete(':id')
  deleteSchedule(@Param() { scheduleId }: { scheduleId: string }) {
    return this.scheduleService.deleteSchedule(scheduleId);
  }
}
