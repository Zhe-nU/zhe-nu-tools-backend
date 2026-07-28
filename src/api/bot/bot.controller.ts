import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BotService } from './bot.service';
import { BotSettingsDto, UpdateBotSettingsDto } from './dto/botSettings.dto';
import { ZodResponse } from 'nestjs-zod';
import { BindScheduleDto, BotDto, UnbindScheduleDto } from './dto/bot.dto';
import { SchedulesWithItemsDto } from '../schedule/dto/schedule.dto';

@Controller('user/:userId/bot')
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Get()
  @ZodResponse({ status: 200, type: BotDto })
  getBot(@Param() { userId }: { userId: string }) {
    return this.botService.getBot(userId);
  }

  @Delete()
  deleteBot(@Param() { userId }: { userId: string }) {
    return this.botService.deleteBot(userId);
  }

  @Post(':botId/bind-schedule')
  bindSchedule(
    @Param() { botId }: { botId: string },
    @Body() { scheduleId }: BindScheduleDto,
  ) {
    return this.botService.bindSchedule(botId, scheduleId);
  }

  @Post(':botId/unbind-schedule')
  unbindSchedule(
    @Param() { botId }: { botId: string },
    @Body() { scheduleId }: UnbindScheduleDto,
  ) {
    return this.botService.unbindSchedule(botId, scheduleId);
  }

  @Get(':botId/schedule')
  @ZodResponse({ status: 200, type: SchedulesWithItemsDto })
  getBotSchedules(@Param() { botId }: { botId: string }) {
    return this.botService.getBotSchedules(botId);
  }

  @Get(':botId/settings')
  @ZodResponse({
    status: 200,
    type: BotSettingsDto,
    description: 'Объект с настройками бота',
  })
  getBotSettings(@Param() { userId }: { userId: string }) {
    return this.botService.getBotSettings(userId);
  }

  @Patch(':botId/settings')
  @ZodResponse({
    status: 200,
    type: BotSettingsDto,
    description: 'Объект с обновленными настройками бота',
  })
  updateBotSettings(
    @Param() { userId }: { userId: string },
    @Body()
    updateBotSettingsDto: UpdateBotSettingsDto,
  ) {
    return this.botService.updateBotSettings(userId, updateBotSettingsDto);
  }
}
