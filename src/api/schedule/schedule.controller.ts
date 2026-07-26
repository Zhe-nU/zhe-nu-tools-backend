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
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import {
  type UpdateScheduleDto,
  updateScheduleSchema,
} from './dto/updateSchedule.dto';
import {
  type CreateScheduleDto,
  createScheduleSchema,
} from './dto/createSchedule.dto';

@Controller('user/:userId/schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  async createSchedule(
    @Param() { userId }: { userId: string },
    @Body(new ZodValidationPipe(createScheduleSchema))
    createScheduleDto: CreateScheduleDto,
  ): Promise<Schedule> {
    return this.scheduleService.createSchedule(userId, createScheduleDto);
  }

  @Get()
  userScheduleList(
    @Param() { userId }: { userId: string },
  ): Promise<Schedule[]> {
    return this.scheduleService.userScheduleList(userId);
  }

  @Get(':scheduleId')
  getSchedule(
    @Param() { scheduleId }: { scheduleId: string },
  ): Promise<Schedule> {
    return this.scheduleService.getSchedule(scheduleId);
  }

  @Patch(':scheduleId')
  updateSchedule(
    @Param() { scheduleId }: { scheduleId: string },
    @Body(new ZodValidationPipe(updateScheduleSchema))
    updateScheduleDto: UpdateScheduleDto,
  ): Promise<Schedule> {
    return this.scheduleService.updateSchedule(scheduleId, updateScheduleDto);
  }

  @Delete(':id')
  deleteSchedule(@Param() { scheduleId }: { scheduleId: string }) {
    return this.scheduleService.deleteSchedule(scheduleId);
  }
}
