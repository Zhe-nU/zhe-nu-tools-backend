import { Controller, Get, Patch, Query, Redirect } from '@nestjs/common';
import { AvitoCallbackService } from './avitoCallback.service';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';

@Controller('api/callback/avito')
export class AvitoCallbackController {
  constructor(private readonly avitoCallbackService: AvitoCallbackService) {}

  @Get()
  @Redirect('http://localhost:3000/dashboard')
  getBotSettings(
    @Query('code') code: string,
    @Session() session: UserSession,
  ): {} {
    return this.avitoCallbackService.oauthAvito(session.user.id, code);
  }
}
