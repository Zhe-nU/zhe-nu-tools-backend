import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AvitoSession } from 'src/models/avitoSession.model';
import { AvitoUser } from 'src/models/avitoUser.model';
import dayjs from 'dayjs';
import { AvitoAPIService } from '../avitoAPI/avitoAPI.service';

const DELTA = 5 * 60 * 1000;

@Injectable()
export class AvitoSessionService {
  constructor(
    @InjectModel(AvitoSession)
    private readonly avitoSessionModel: typeof AvitoSession,
    @Inject(forwardRef(() => AvitoAPIService))
    private readonly avitoAPIService: AvitoAPIService,
  ) {}

  async getAccessTokenByAvitoId(avitoId: string) {
    const session = await this.avitoSessionModel.findOne({
      include: [
        {
          model: AvitoUser,
          where: { avitoId },
        },
      ],
    });
    if (!session) return null;

    if (
      dayjs(session.updatedAt).add(session.expiresIn + DELTA, 'ms') < dayjs()
    ) {
      const newSession = await this.avitoAPIService.refreshToken(
        session.refreshToken,
      );
      await session.update(newSession);
    }

    return session.accessToken;
  }

  async getAvitoSessionByAvitoUserId(avitoId: string) {
    return this.avitoSessionModel.findOne({
      include: { model: AvitoUser, where: { avitoId } },
    });
  }
}
