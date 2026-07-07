import { Controller, Get, Patch, Query, Redirect } from '@nestjs/common';
import { AvitoCallbackService } from './avitoCallback.service';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';

@Controller('api/callback/avito')
export class AvitoCallbackController {
  constructor(private readonly avitoCallbackService: AvitoCallbackService) {}

  @Get()
  @Redirect()
  async getBotSettings(
    @Query('code') code: string,
    @Session() session: UserSession,
  ) {
    await this.avitoCallbackService.oauthAvito(session.user.id, code);

    return {
      url: `${process.env.CLIENT_URL}/dashboard/manage-bot`,
    };
  }
}
