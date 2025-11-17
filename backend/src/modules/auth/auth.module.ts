import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthSessionEntity } from '../../entities/auth-session.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthSessionEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService], 
  exports: [AuthService]
})
export class AuthModule {}