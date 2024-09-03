import { Test, TestingModule } from '@nestjs/testing';
import { StaticController } from '../auth-controller/auth.controller';

describe('StaticController', () => {
  let controller: StaticController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaticController],
    }).compile();

    controller = module.get<StaticController>(StaticController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
