import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { SuperAdmin } from './entities/super-admin.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SuperAdminService {
  constructor(
    @InjectRepository(SuperAdmin)
    private readonly superAdminRepository: Repository<SuperAdmin>,
  ) { }

  findAll() {
    return this.superAdminRepository.find();
  }

  findOne(id: string) {
    return this.superAdminRepository.findOne({ where: { id } });
  }

  remove(id: string) {
    return this.superAdminRepository.delete(id);
  }
}
