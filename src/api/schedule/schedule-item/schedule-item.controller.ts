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
} from '@nestjs/common';
import { ZodResponse } from 'nestjs-zod';
import {
  CreateScheduleItemDto,
  ScheduleItemDto,
  ScheduleItemsDto,
  UpdateScheduleItemDto,
} from './dto/schedule-item.dto';
import { ScheduleItemService } from './schedule-item.service';
import { ApiParam } from '@nestjs/swagger';

@ApiParam({ name: 'userId', type: 'string', format: 'uuid' })
@ApiParam({ name: 'scheduleId', type: 'string', format: 'uuid' })
@Controller()
export class ScheduleItemController {
  constructor(private readonly scheduleItemService: ScheduleItemService) {}

  @Post()
  @ZodResponse({ status: HttpStatus.OK, type: ScheduleItemDto })
  createScheduleItem(
    @Param('scheduleId') scheduleId: string,
    @Body() createScheduleItemDto: CreateScheduleItemDto,
  ) {
    return this.scheduleItemService.createScheduleItem(
      scheduleId,
      createScheduleItemDto,
    );
  }

  @Get()
  @ZodResponse({ status: HttpStatus.OK, type: ScheduleItemsDto })
  getScheduleItems(@Param('scheduleId') scheduleId: string) {
    return this.scheduleItemService.getScheduleItems(scheduleId);
  }

  @Get(':itemId')
  @ZodResponse({ status: HttpStatus.OK, type: ScheduleItemDto })
  getScheduleItem(@Param('itemId') itemId: string) {
    return this.scheduleItemService.getScheduleItem(itemId);
  }

  @Patch(':itemId')
  @ZodResponse({ status: HttpStatus.OK, type: ScheduleItemDto })
  updateScheduleItem(
    @Param('itemId') itemId: string,
    @Body() updateScheduleItemDto: UpdateScheduleItemDto,
  ) {
    return this.scheduleItemService.updateScheduleItem(
      itemId,
      updateScheduleItemDto,
    );
  }

  @Delete(':itemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteScheduleItem(@Param('itemId') itemId: string) {
    return this.scheduleItemService.deleteScheduleItem(itemId);
  }
}
