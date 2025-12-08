import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PersonEntity } from '@shared/entities/person.entity';

import { PersonController } from './controller/person.controller';
import { PersonService } from './service/person.service';
import { PersonStateService } from './service/person-state/person-state.service';
import { PersonSessionService } from './service/person-session/person-session.service';
import { PersonStateController } from './controller/person-state/person-state.controller';
import { PersonSessionEntity } from '@shared/entities/person-session.entity';
import { PersonStateEntity } from '@shared/entities/person-state.entity';

@Module({
    imports: [TypeOrmModule.forFeature([PersonEntity, PersonSessionEntity, PersonStateEntity])],
    controllers: [PersonController, PersonStateController],
    providers: [PersonService, PersonStateService, PersonSessionService],
    exports: [PersonService],
})
export class PersonModule {}
