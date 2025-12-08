import { Test, TestingModule } from '@nestjs/testing';
import { MediaManagerController } from './media-manger.controller';

describe('MediaManagerController', () => {
  let controller: MediaManagerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MediaManagerController],
    }).compile();

    controller = module.get<MediaManagerController>(MediaManagerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
