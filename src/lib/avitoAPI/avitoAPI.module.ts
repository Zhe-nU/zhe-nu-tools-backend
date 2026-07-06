import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { AvitoAPIService } from './avitoAPI.service';
import { AvitoSessionModule } from '../avitoSession/avitoSession.module';

@Module({
  imports: [forwardRef(() => AvitoSessionModule), HttpModule],
  providers: [AvitoAPIService],
  exports: [AvitoAPIService],
})
export class AvitoAPIModule {}
