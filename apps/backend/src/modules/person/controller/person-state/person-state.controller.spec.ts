import { Test, TestingModule } from '@nestjs/testing';

import { PersonStateController } from './person-state.controller';

describe('PersonStateController', () => {
    let controller: PersonStateController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PersonStateController],
        }).compile();

        controller = module.get<PersonStateController>(PersonStateController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
