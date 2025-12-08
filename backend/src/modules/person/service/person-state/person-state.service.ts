// src/modules/person/service/person-state/person-state.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PersonStateEntity } from '@shared/entities/person-state.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PersonStateService {
    constructor(
        @InjectRepository(PersonStateEntity)
        private readonly personStateRepository: Repository<PersonStateEntity>,
    ) {}

    async getPersonState(personId: number): Promise<any> {
        const state = await this.personStateRepository.findOne({
            where: { personId }
        });

        return state ? state.state : null;
    }

    async setPersonState(personId: number, state: any): Promise<void> {
        let personState = await this.personStateRepository.findOne({
            where: { personId }
        });

        if (personState) {
            personState.state = state;
            personState.updatedAt = new Date();
            personState.lastActiveAt = new Date();
        } else {
            personState = this.personStateRepository.create({
                personId,
                state,
                lastActiveAt: new Date(),
            });
        }

        await this.personStateRepository.save(personState);
    }

    async clearPersonState(personId: number): Promise<void> {
        await this.personStateRepository.delete({ personId });
    }

    // Дополнительные методы
    async setOnlineStatus(personId: number, isOnline: boolean): Promise<void> {
        let personState = await this.personStateRepository.findOne({
            where: { personId }
        });

        if (personState) {
            personState.isOnline = isOnline;
            personState.lastActiveAt = new Date();
            personState.status = isOnline ? 'online' : 'offline';
        } else {
            personState = this.personStateRepository.create({
                personId,
                isOnline,
                status: isOnline ? 'online' : 'offline',
                lastActiveAt: new Date(),
            });
        }

        await this.personStateRepository.save(personState);
    }

    async getOnlineStatus(personId: number): Promise<boolean> {
        const state = await this.personStateRepository.findOne({
            where: { personId }
        });

        return state ? state.isOnline : false;
    }
}