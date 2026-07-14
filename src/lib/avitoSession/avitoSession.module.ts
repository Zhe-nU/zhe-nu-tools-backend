import { forwardRef, Module } from '@nestjs/common';
import { AvitoSessionService } from './avitoSession.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AvitoSession } from 'src/models/avitoSession.model';
import { AvitoAPIModule } from '../avitoAPI/avitoAPI.module';

@Module({
  imports: [
    forwardRef(() => AvitoAPIModule),
    SequelizeModule.forFeature([AvitoSession]),
  ],
  providers: [AvitoSessionService],
  exports: [AvitoSessionService],
})
export class AvitoSessionModule {}
