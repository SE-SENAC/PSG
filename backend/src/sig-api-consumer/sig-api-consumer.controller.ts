import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { CompressedCacheInterceptor } from '../common/interceptors/compressed-cache.interceptor';
import { SigApiConsumerService } from './sig-api-consumer.service';
import { CreateSigApiConsumerDto } from './dto/create-sig-api-consumer.dto';
import { UpdateSigApiConsumerDto } from './dto/update-sig-api-consumer.dto';
import axios from 'axios';

@Controller('sig-api-consumer')
@UseInterceptors(CompressedCacheInterceptor)
export class SigApiConsumerController {
  constructor(private readonly sigApiConsumerService: SigApiConsumerService) {}

  @Post()
  create(@Body() createSigApiConsumerDto: CreateSigApiConsumerDto) {
    return this.sigApiConsumerService.create(createSigApiConsumerDto);
  }

  @Get()
  findAll() {
    return this.sigApiConsumerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sigApiConsumerService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSigApiConsumerDto: UpdateSigApiConsumerDto,
  ) {
    return this.sigApiConsumerService.update(+id, updateSigApiConsumerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sigApiConsumerService.remove(+id);
  }
}
