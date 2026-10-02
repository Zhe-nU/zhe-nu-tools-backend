import { HttpService } from '@nestjs/axios';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AvitoSessionService } from '../avitoSession/avitoSession.service';
import {
  avitoChatMessagesDto,
  AvitoChatMessagesDto,
} from './dto/avitoChatMessages.dto';
import { AvitoChatDataDto } from './dto/avitoChatData.dto';
import {
  ApiAvitoItemResponse,
  apiAvitoItemsResponseSchema,
} from 'src/api/avito-items/dto/api-avito-items.dto';

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
  private readonly logger = new Logger(AvitoAPIService.name);

  constructor(
    @Inject(forwardRef(() => AvitoSessionService))
    private readonly avitoSessionService: AvitoSessionService,
    private readonly httpService: HttpService,
  ) {}

  async addWebhook(avitoId: string) {
    const accessToken =
      await this.avitoSessionService.getAccessTokenByAvitoId(avitoId);

    await firstValueFrom(
      this.httpService.post(
        'https://api.avito.ru/messenger/v3/webhook',
        {
          url: process.env.AVITO_WEBHOOK_BASE_URL,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ),
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
    params: { limit: number };
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

  /**
   *
   * @param avitoId
   * @param params - Объект с query параметрами для API Avito
   * @param params.updatedAtFrom - Фильтр больше либо равно по дате обновления/редактирования объявления в формате YYYY-MM-DD
   * @returns
   */

  async getUserItems(
    avitoId: string,
    params?: {
      perPage?: number;
      page?: number;
      status?: 'active' | 'removed' | 'old' | 'blocked' | 'rejected';
      updatedAtFrom?: string;
      category?: number;
    },
  ): Promise<ApiAvitoItemResponse> {
    const accessToken =
      await this.avitoSessionService.getAccessTokenByAvitoId(avitoId);

    const data = await firstValueFrom(
      this.httpService.get('https://api.avito.ru/core/v1/items', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: params && {
          per_page: params.perPage,
          ...params,
        },
      }),
    );

    const parsed = apiAvitoItemsResponseSchema.safeParse(data);
    if (!parsed.success) {
      this.logger.error('Avito API contract violation', parsed.error);
      throw new Error('Unexpected response from Avito API');
    }

    return parsed.data;
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

  async unsubscribeWebhook(avitoId: string) {
    const accessToken =
      await this.avitoSessionService.getAccessTokenByAvitoId(avitoId);

    await firstValueFrom(
      this.httpService.post(
        'https://api.avito.ru/messenger/v1/webhook/unsubscribe',
        {
          url: process.env.AVITO_WEBHOOK_BASE_URL,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ),
    );
  }
}
