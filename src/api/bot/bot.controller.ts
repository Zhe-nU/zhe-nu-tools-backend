import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BotService } from './bot.service';
import { BotSettingsDto, UpdateBotSettingsDto } from './dto/botSettings.dto';
import { ZodResponse } from 'nestjs-zod';
import { BindScheduleDto, BotDto, UnbindScheduleDto } from './dto/bot.dto';
import { SchedulesWithItemsDto } from '../schedule/dto/schedule.dto';
import { ApiParam } from '@nestjs/swagger';
import { OwnershipGuard } from 'src/guards/ownership.guard';

@ApiParam({ name: 'userId', type: 'string', format: 'uuid' })
@UseGuards(OwnershipGuard)
@Controller('user/:userId/bot')
export class BotController {
  constructor(private readonly botService: BotService) {}

  @ApiParam({ name: 'botId', type: 'string', format: 'uuid' })
  @Get(':botId')
  @ZodResponse({ status: 200, type: BotDto })
  getBot(@Param('userId') userId: string, @Param('botId') botId: string) {
    return this.botService.getBot(userId, botId);
  }

  @ApiParam({ name: 'botId', type: 'string', format: 'uuid' })
  @Delete(':botId')
  deleteBot(@Param('userId') userId: string, @Param('botId') botId: string) {
    return this.botService.deleteBot(userId, botId);
  }

  @Post(':botId/bind-schedule')
  @ApiParam({ name: 'botId', type: 'string', format: 'uuid' })
  bindSchedule(
    @Param('botId') botId: string,
    @Body() { scheduleId }: BindScheduleDto,
  ) {
    return this.botService.bindSchedule(botId, scheduleId);
  }

  @Post(':botId/unbind-schedule')
  @ApiParam({ name: 'botId', type: 'string', format: 'uuid' })
  unbindSchedule(
    @Param('botId') botId: string,
    @Body() { scheduleId }: UnbindScheduleDto,
  ) {
    return this.botService.unbindSchedule(botId, scheduleId);
  }

  @Get(':botId/schedule')
  @ApiParam({ name: 'botId', type: 'string', format: 'uuid' })
  @ZodResponse({ status: 200, type: SchedulesWithItemsDto })
  getBotSchedules(@Param('botId') botId: string) {
    return this.botService.getBotSchedules(botId);
  }

  @Get(':botId/settings')
  @ApiParam({ name: 'botId', type: 'string', format: 'uuid' })
  @ZodResponse({
    status: 200,
    type: BotSettingsDto,
    description: 'Объект с настройками бота',
  })
  getBotSettings(@Param('botId') botId: string) {
    return this.botService.getBotSettings(botId);
  }

  @Patch(':botId/settings')
  @ApiParam({ name: 'botId', type: 'string', format: 'uuid' })
  @ZodResponse({
    status: 200,
    type: BotSettingsDto,
    description: 'Объект с обновленными настройками бота',
  })
  updateBotSettings(
    @Param('botId') botId: string,
    @Body()
    updateBotSettingsDto: UpdateBotSettingsDto,
  ) {
    return this.botService.updateBotSettings(botId, updateBotSettingsDto);
  }
}
