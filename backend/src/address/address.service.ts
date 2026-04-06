import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  create(createAddressDto: CreateAddressDto) {
    return this.addressRepository.create(createAddressDto);
  }

  findAll() {
    return this.addressRepository.find();
  }

  findOne(id: string) {
    return this.addressRepository.findOne({ where: { id } });
  }

  update(id: string, updateAddressDto: UpdateAddressDto) {
    return this.addressRepository.update(id, updateAddressDto);
  }

  remove(id: string) {
    return this.addressRepository.delete(id);
  }
}
