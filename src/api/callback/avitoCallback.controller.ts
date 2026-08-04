import { Controller, Get, Query, Redirect } from '@nestjs/common';
import { AvitoCallbackService } from './avitoCallback.service';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import { ApiTemporaryRedirectResponse } from '@nestjs/swagger';

@Controller('callback/avito')
export class AvitoCallbackController {
  constructor(private readonly avitoCallbackService: AvitoCallbackService) {}

  @Get()
  @Redirect()
  @ApiTemporaryRedirectResponse({
    description:
      'Редирект на панель управления. В случае, если существует пользователь с привязанным avito аккаунтом, то редирект будет с дополнительным query параметром error=BOT_ALREADY_LINKED',
    links: {
      Dashboard: {
        description: 'Панель управления',
      },
    },
  })
  async getBotSettings(
    @Query('code') code: string,
    @Session() session: UserSession,
  ) {
    const { success, reason } = await this.avitoCallbackService.oauthAvito(
      session.user.id,
      code,
    );

    if (!success)
      return {
        url: `${process.env.CLIENT_URL}/dashboard/manage-bot?error=${reason}`,
      };
    else
      return {
        url: `${process.env.CLIENT_URL}/dashboard/manage-bot`,
      };
  }
}
