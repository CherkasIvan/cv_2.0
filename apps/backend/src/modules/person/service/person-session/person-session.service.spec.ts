import { Test, TestingModule } from '@nestjs/testing';

import { PersonSessionService } from './person-session.service';

describe('PersonSessionService', () => {
    let service: PersonSessionService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PersonSessionService],
        }).compile();

        service = module.get<PersonSessionService>(PersonSessionService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
