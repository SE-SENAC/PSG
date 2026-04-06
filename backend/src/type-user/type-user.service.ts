import { Injectable } from '@nestjs/common';
import { CreateTypeUserDto } from './dto/create-type-user.dto';
import { UpdateTypeUserDto } from './dto/update-type-user.dto';
import { TypeUser } from './entities/type-user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TypeUserService {
  constructor(
    @InjectRepository(TypeUser)
    private readonly typeUserRepository: Repository<TypeUser>,
  ) {}
  create(createTypeUserDto: CreateTypeUserDto) {
    return this.typeUserRepository.save(createTypeUserDto);
  }

  findAll() {
    return this.typeUserRepository.find();
  }

  findOne(id: string) {
    return this.typeUserRepository.findOne({ where: { id } });
  }

  update(id: string, updateTypeUserDto: UpdateTypeUserDto) {
    return this.typeUserRepository.update(id, updateTypeUserDto);
  }

  remove(id: string) {
    return this.typeUserRepository.delete(id);
  }
}
