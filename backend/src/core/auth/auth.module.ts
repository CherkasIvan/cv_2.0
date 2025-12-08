import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtAuthGuard } from '@core/guard/jwt-auth/jwt-auth.guard';
import { JwtStrategy } from '@core/strategy/jwt.strategy';

import { PersonEntity } from '@shared/entities/person.entity';
import { PersonSessionEntity } from '@shared/entities/person-session.entity'; // Добавьте эту строку

import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { PersonSessionService } from 'src/modules/person/service/person-session/person-session.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([PersonEntity, PersonSessionEntity]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.get('JWT_EXPIRES_IN') || '1h',
                },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, PersonSessionService, JwtStrategy, JwtAuthGuard],
    exports: [AuthService, JwtModule],
})
export class AuthModule {}