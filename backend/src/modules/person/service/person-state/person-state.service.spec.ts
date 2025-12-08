import { Test, TestingModule } from '@nestjs/testing';
import { PersonStateService } from './person-state.service';

describe('PersonStateService', () => {
  let service: PersonStateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PersonStateService],
    }).compile();

    service = module.get<PersonStateService>(PersonStateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
