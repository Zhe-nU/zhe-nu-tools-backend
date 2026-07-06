import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AvitoUser } from 'src/models/avitoUser.model';
import { User } from 'src/models/user.model';
import { AvitoUserService } from './avitoUser.service';

@Module({
  imports: [SequelizeModule.forFeature([AvitoUser, User])],
  providers: [AvitoUserService],
  exports: [AvitoUserService],
})
export class AvitoUserModule {}
