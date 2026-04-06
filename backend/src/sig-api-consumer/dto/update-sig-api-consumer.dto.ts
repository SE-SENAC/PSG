import { PartialType } from '@nestjs/mapped-types';
import { CreateSigApiConsumerDto } from './create-sig-api-consumer.dto';

export class UpdateSigApiConsumerDto extends PartialType(CreateSigApiConsumerDto) {}
