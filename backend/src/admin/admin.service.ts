import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { User } from 'src/user/entities/user.entity';
import { TypeUser } from 'src/type-user/entities/type-user.entity';
import { ROLE } from 'src/type-user/enum/enum';
import * as bcrypt from 'bcrypt';
import { Student } from 'src/student/entities/student.entity';
import { Address } from 'src/address/entities/address.entity';
import { Phone } from 'src/phone/entities/phone.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(Phone)
    private readonly phoneRepository: Repository<Phone>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(TypeUser)
    private readonly typeUserRepository: Repository<TypeUser>,
  ) {}

  findAll() {
    return this.adminRepository.find();
  }

  findOne(id: string) {
    return this.adminRepository.findOne({ where: { id } });
  }

  findOneByEmail(data: any) {
    return this.userRepository.findOne({ where: { email: data.email } });
  }

  async createAdminFromScratch(data: CreateAdminDto) {
    const { name, email, password } = data;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new Error('Email já está em uso');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let typeUser = await this.typeUserRepository.findOne({
      where: { role: ROLE.ADMIN },
    });
    if (!typeUser) {
      typeUser = await this.typeUserRepository.save({ role: ROLE.ADMIN });
    }

    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      isActive: true,
      typeUser: typeUser,
    });

    const savedUser = await this.userRepository.save(user);

    const admin = this.adminRepository.create({
      user: savedUser,
    });

    return this.adminRepository.save(admin);
  }

  remove(id: string) {
    return this.adminRepository.delete(id);
  }
}
