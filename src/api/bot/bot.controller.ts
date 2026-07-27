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
import {
  BotSettingsDto,
  UpdateBotSettingsDto,
} from './dto/updateBotSettings.dto';
import { ZodResponse } from 'nestjs-zod';

@Controller('user/:userId/bot')
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Get()
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
    @Body() { scheduleId }: { scheduleId: string },
  ) {
    return this.botService.bindSchedule(botId, scheduleId);
  }

  @Post(':botId/unbind-schedule')
  unbindSchedule(
    @Param() { botId }: { botId: string },
    @Body() { scheduleId }: { scheduleId: string },
  ) {
    return this.botService.unbindSchedule(botId, scheduleId);
  }

  @Get(':botId/schedule')
  getBotSchedules(@Param() { botId }: { botId: string }) {
    return this.botService.getBotSchedules(botId);
  }

  @Get('settings')
  @ZodResponse({
    status: 200,
    type: BotSettingsDto,
    description: 'Объект с настройками бота',
  })
  getBotSettings(@Param() { userId }: { userId: string }) {
    return this.botService.getBotSettings(userId);
  }

  @Patch('settings')
  @ZodResponse({
    status: 200,
    type: BotSettingsDto,
    description: 'Объект с обновленными настройками бота',
  })
  updateBotSettings(
    @Param() { userId }: { userId: string },
    // @Body(new ZodValidationPipe(updateBotSettingsSchema))
    @Body()
    updateBotSettingsDto: UpdateBotSettingsDto,
  ) {
    return this.botService.updateBotSettings(userId, updateBotSettingsDto);
  }
}
