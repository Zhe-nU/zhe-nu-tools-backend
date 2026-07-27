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
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import {
  type UpdateBotSettingsDto,
  updateBotSettingsSchema,
} from './dto/updateBotSettings.dto';

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
  getBotSettings(@Param() { userId }: { userId: string }) {
    return this.botService.getBotSettings(userId);
  }

  @Patch('settings')
  updateBotSettings(
    @Param() { userId }: { userId: string },
    @Body(new ZodValidationPipe(updateBotSettingsSchema))
    body: UpdateBotSettingsDto,
  ) {
    return this.botService.updateBotSettings(userId, body);
  }
}
