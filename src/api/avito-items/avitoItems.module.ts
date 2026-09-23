import { Module } from '@nestjs/common';
import { AvitoAPIModule } from '../../lib/avitoAPI/avitoAPI.module';

@Module({
  imports: [AvitoAPIModule],
  controllers: [],
  providers: [],
})
export class AvitoItemsModule {}
