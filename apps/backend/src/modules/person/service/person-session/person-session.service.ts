import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonSessionEntity } from '@shared/entities/person-session.entity';

@Injectable()
export class PersonSessionService {
    constructor(
        @InjectRepository(PersonSessionEntity)
        private readonly sessionRepository: Repository<PersonSessionEntity>,
    ) {}

    async createSession(
        personId: number,
        accessToken: string,
        refreshToken: string,
        accessTokenExpires: Date,
        refreshTokenExpires: Date,
        ipAddress?: string,
        userAgent?: string,
    ): Promise<PersonSessionEntity> {
        const session = this.sessionRepository.create({
            personId,
            accessToken,
            refreshToken,
            accessTokenExpires,
            refreshTokenExpires,
            ipAddress,
            userAgent,
            isActive: true,
        });

        return await this.sessionRepository.save(session);
    }

    async findSessionById(sessionId: number): Promise<PersonSessionEntity> {
        return await this.sessionRepository.findOne({
            where: { id: sessionId },
            relations: ['person'],
        });
    }

    async findActiveSessionByAccessToken(accessToken: string): Promise<PersonSessionEntity> {
        return await this.sessionRepository.findOne({
            where: { 
                accessToken,
                isActive: true 
            },
            relations: ['person'],
        });
    }

    async findActiveSessionByRefreshToken(refreshToken: string): Promise<PersonSessionEntity> {
        return await this.sessionRepository.findOne({
            where: { 
                refreshToken,
                isActive: true 
            },
            relations: ['person'],
        });
    }

    async deactivateSession(sessionId: number): Promise<void> {
        await this.sessionRepository.update(sessionId, {
            isActive: false,
        });
    }

    async updateLastActivity(sessionId: number): Promise<void> {
        await this.sessionRepository.update(sessionId, {
            lastActivityAt: new Date(),
        });
    }

    async deactivateAllUserSessions(personId: number): Promise<void> {
        await this.sessionRepository.update(
            { personId, isActive: true },
            { isActive: false }
        );
    }

    async cleanupExpiredSessions(): Promise<void> {
        await this.sessionRepository
            .createQueryBuilder()
            .delete()
            .where('isActive = :isActive AND refreshTokenExpires < :now', {
                isActive: true,
                now: new Date(),
            })
            .execute();
    }
}