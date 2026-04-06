import { Test, TestingModule } from '@nestjs/testing';
import { SigApiConsumerService } from './sig-api-consumer.service';

describe('SigApiConsumerService', () => {
  let service: SigApiConsumerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SigApiConsumerService],
    }).compile();

    service = module.get<SigApiConsumerService>(SigApiConsumerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
