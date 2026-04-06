import { Test, TestingModule } from '@nestjs/testing';
import { SigApiConsumerController } from './sig-api-consumer.controller';
import { SigApiConsumerService } from './sig-api-consumer.service';

describe('SigApiConsumerController', () => {
  let controller: SigApiConsumerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SigApiConsumerController],
      providers: [SigApiConsumerService],
    }).compile();

    controller = module.get<SigApiConsumerController>(SigApiConsumerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
