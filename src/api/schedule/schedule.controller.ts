import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
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
import { ApiParam } from '@nestjs/swagger';
import { OwnershipGuard } from 'src/guards/ownership.guard';

@ApiParam({ name: 'userId', type: 'string', format: 'uuid' })
@UseGuards(OwnershipGuard)
@Controller()
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  @ZodResponse({ status: HttpStatus.OK, type: ScheduleDto })
  async createSchedule(
    @Param('userId') userId: string,
    @Body()
    createScheduleDto: CreateScheduleDto,
  ): Promise<Schedule> {
    return this.scheduleService.createSchedule(userId, createScheduleDto);
  }

  @Get()
  @ZodResponse({ status: HttpStatus.OK, type: SchedulesWithItemsDto })
  userScheduleList(@Param('userId') userId: string): Promise<Schedule[]> {
    return this.scheduleService.userScheduleList(userId);
  }

  @Get(':scheduleId')
  @ZodResponse({ status: HttpStatus.OK, type: ScheduleWithItemsDto })
  getSchedule(@Param('scheduleId') scheduleId: string): Promise<Schedule> {
    return this.scheduleService.getSchedule(scheduleId);
  }

  @Patch(':scheduleId')
  @ZodResponse({ status: HttpStatus.OK, type: ScheduleWithItemsDto })
  updateSchedule(
    @Param('scheduleId') scheduleId: string,
    @Body()
    updateScheduleDto: UpdateScheduleDto,
  ): Promise<Schedule> {
    return this.scheduleService.updateSchedule(scheduleId, updateScheduleDto);
  }

  @Delete(':scheduleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteSchedule(@Param('scheduleId') scheduleId: string) {
    return this.scheduleService.deleteSchedule(scheduleId);
  }
}
