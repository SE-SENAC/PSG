import { Injectable } from '@nestjs/common';
import { CreateEditalDto } from './dto/create-edital.dto';
import { UpdateEditalDto } from './dto/update-edital.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Edital } from './entities/edital.entity';
import { Repository } from 'typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class EditalService {
  constructor(
    @InjectRepository(Edital)
    private readonly editalRepository: Repository<Edital>,
  ) {}

  async create(createEditalDto: CreateEditalDto) {
    return await this.editalRepository.save(createEditalDto);
  }

  async findAll(option: IPaginationOptions): Promise<Pagination<Edital>> {
    return await paginate<Edital>(this.editalRepository, option, {
      order: { title: 'ASC' },
    });
  }

  async findOne(id: string) {
    return await this.editalRepository.findOne({ where: { id } });
  }

  async update(id: string, updateEditalDto: UpdateEditalDto) {
    return await this.editalRepository.update(id, updateEditalDto);
  }

  async remove(id: string) {
    return await this.editalRepository.delete(id);
  }
}
