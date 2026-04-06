import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { ROLE } from 'src/type-user/enum/enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.UserRepository.save(createUserDto);
  }

  findAll(options: IPaginationOptions): Promise<Pagination<User>> {
    return paginate<User>(this.UserRepository, options, {
      where: { isActive: true, typeUser: { role: ROLE.CLIENT } },
      order: {
        id: 'DESC',
      },
    });
  }

  findOne(id: string) {
    return this.UserRepository.find({ where: { id } });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.UserRepository.update(id, updateUserDto);
  }

  remove(id: string) {
    return this.UserRepository.delete(id);
  }
}
