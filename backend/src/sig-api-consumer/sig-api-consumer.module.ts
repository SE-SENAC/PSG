import { Module } from '@nestjs/common';
import { SigApiConsumerService } from './sig-api-consumer.service';
import { SigApiConsumerController } from './sig-api-consumer.controller';

@Module({
  controllers: [SigApiConsumerController],
  providers: [SigApiConsumerService],
})
export class SigApiConsumerModule {}
