import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
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
