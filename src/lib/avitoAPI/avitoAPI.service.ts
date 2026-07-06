import { HttpService } from '@nestjs/axios';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AvitoSessionService } from '../avitoSession/avitoSession.service';
import {
  avitoChatMessagesDto,
  AvitoChatMessagesDto,
} from './dto/avitoChatMessages.dto';
import { AvitoChatDataDto } from './dto/avitoChatData.dto';
import { AxiosRequestConfig, Method } from 'axios';

type RESTAvitoTokenData = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
};

type RESTAvitoUserData = {
  id: number;
  name: string;
  email: string;
  phone: string;
  profile_url: string;
};

@Injectable()
export class AvitoAPIService {
  constructor(
    @Inject(forwardRef(() => AvitoSessionService))
    private readonly avitoSessionService: AvitoSessionService,
    private readonly httpService: HttpService,
  ) {}

  async addWebhook(avitoId: string) {
    const accessToken =
      await this.avitoSessionService.getAccessTokenByAvitoId(avitoId);

    this.httpService.post(
      'https://api.avito.ru/messenger/v3/webhook',
      {
        url: `${process.env.WEBHOOK_BASE_URL}webhook/avito`,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  }

  async getChatData(avitoId: string, chatId: string) {
    const accessToken =
      await this.avitoSessionService.getAccessTokenByAvitoId(avitoId);

    const { data: chatData } = await firstValueFrom(
      this.httpService.get<AvitoChatDataDto>(
        `https://api.avito.ru/messenger/v2/accounts/${avitoId}/chats/${chatId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      ),
    );

    return chatData;
  }

  async getChatMessages({
    avitoId,
    chatId,
    params,
  }: {
    avitoId: string;
    chatId: string;
    params: any;
  }) {
    const accessToken =
      await this.avitoSessionService.getAccessTokenByAvitoId(avitoId);

    const { data } = await firstValueFrom(
      this.httpService.get<AvitoChatMessagesDto>(
        `https://api.avito.ru/messenger/v3/accounts/${avitoId}/chats/${chatId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          params,
        },
      ),
    );

    return avitoChatMessagesDto.parse(data).messages;
  }

  async getToken(code: string) {
    const data = {
      grant_type: 'authorization_code',
      client_id: process.env.AVITO_CLIENT_ID,
      client_secret: process.env.AVITO_CLIENT_SECRET,
      code,
    };

    const { data: tokenData } = await firstValueFrom(
      this.httpService.post<RESTAvitoTokenData>(
        'https://api.avito.ru/token',
        data,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      ),
    );

    return {
      accessToken: tokenData.access_token,
      expiresIn: tokenData.expires_in * 1000,
      refreshToken: tokenData.refresh_token,
      scope: tokenData.scope,
      tokenType: tokenData.token_type,
    };
  }

  async getSelf(token: string) {
    const { data } = await firstValueFrom(
      this.httpService.get<RESTAvitoUserData>(
        'https://api.avito.ru/core/v1/accounts/self',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    );

    return {
      avitoId: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      profileUrl: data.profile_url,
    };
  }

  async getUser(avitoId: string) {
    const accessToken =
      await this.avitoSessionService.getAccessTokenByAvitoId(avitoId);

    const { data } = await firstValueFrom(
      this.httpService.get<RESTAvitoUserData>(
        'https://api.avito.ru/core/v1/accounts/self',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ),
    );

    return {
      avitoId: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      profileUrl: data.profile_url,
    };
  }

  async refreshToken(refreshToken: string) {
    const data = {
      client_id: process.env.AVITO_CLIENT_ID,
      client_secret: process.env.AVITO_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    };

    const { data: newTokenData } = await firstValueFrom(
      this.httpService.post<RESTAvitoTokenData>(
        'https://api.avito.ru/token/',
        data,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      ),
    );

    return {
      accessToken: newTokenData.access_token,
      expiresIn: newTokenData.expires_in * 1000,
      refreshToken: newTokenData.refresh_token,
      scope: newTokenData.scope,
      tokenType: newTokenData.token_type,
    };
  }

  async sendMessageToChat({
    avitoId,
    chatId,
    text,
  }: {
    avitoId: string;
    chatId: string;
    text: string;
  }) {
    const accessToken =
      await this.avitoSessionService.getAccessTokenByAvitoId(avitoId);

    const data = {
      message: {
        text,
      },
      type: 'text',
    };

    await firstValueFrom(
      this.httpService.post(
        `https://api.avito.ru/messenger/v1/accounts/${avitoId}/chats/${chatId}/messages`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ),
    );
  }
}
