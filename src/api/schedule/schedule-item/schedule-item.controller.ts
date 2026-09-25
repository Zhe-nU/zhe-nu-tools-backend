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
  BulkCreateScheduleItemsDto,
  BulkUpdateScheduleItemsDto,
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

  @Post('bulk')
  @ZodResponse({ status: HttpStatus.OK, type: ScheduleItemsDto })
  bulkCreateScheduleItems(
    @Param('scheduleId') scheduleId: string,
    @Body() bulkCreateScheduleItemDto: BulkCreateScheduleItemsDto,
  ) {
    return this.scheduleItemService.bulkCreateScheduleItems(
      scheduleId,
      bulkCreateScheduleItemDto,
    );
  }

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

  @Patch('bulk')
  @ZodResponse({ status: HttpStatus.OK, type: ScheduleItemsDto })
  bulkUpdateScheduleItems(
    @Body() bulkUpdateScheduleItemDto: BulkUpdateScheduleItemsDto,
  ) {
    return this.scheduleItemService.bulkUpdateScheduleItems(
      bulkUpdateScheduleItemDto,
    );
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
