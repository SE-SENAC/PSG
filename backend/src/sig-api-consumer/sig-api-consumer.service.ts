import { Injectable } from '@nestjs/common';
import { CreateSigApiConsumerDto } from './dto/create-sig-api-consumer.dto';
import { UpdateSigApiConsumerDto } from './dto/update-sig-api-consumer.dto';
import axios from 'axios';

@Injectable()
export class SigApiConsumerService {
  async create(createSigApiConsumerDto: CreateSigApiConsumerDto) {
    return 'This action adds a new sigApiConsumer';
  }

  async findAll() {
    return `This action returns all sigApiConsumer`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} sigApiConsumer`;
  }

  async update(id: number, updateSigApiConsumerDto: UpdateSigApiConsumerDto) {
    return `This action updates a #${id} sigApiConsumer`;
  }

  async remove(id: number) {
    return `This action removes a #${id} sigApiConsumer`;
  }

  async get_cpf(cpf: string) {
    const response = await axios.get(`https://www.google.com/api/pessoa`);
    return response.data;
  }
}
