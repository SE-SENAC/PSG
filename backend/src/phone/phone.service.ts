import { Injectable } from '@nestjs/common';
import { CreatePhoneDto } from './dto/create-phone.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Phone } from './entities/phone.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PhoneService {
  constructor(
    @InjectRepository(Phone)
    private readonly phoneRepository: Repository<Phone>,
  ) {}

  create(createPhoneDto: CreatePhoneDto) {
    return this.phoneRepository.create(createPhoneDto);
  }

  findAll() {
    return this.phoneRepository.find();
  }

  findOne(id: string) {
    return this.phoneRepository.findOne({ where: { id } });
  }

  update(id: string, updatePhoneDto: UpdatePhoneDto) {
    return this.phoneRepository.update(id, updatePhoneDto);
  }

  remove(id: string) {
    return this.phoneRepository.delete(id);
  }
}
