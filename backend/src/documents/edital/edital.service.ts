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

  async findAll(option: IPaginationOptions, search?: string): Promise<Pagination<Edital>> {
    const queryBuilder = this.editalRepository.createQueryBuilder('edital');
    
    if (search) {
      queryBuilder.where('edital.title LIKE :search', { 
        search: `%${search}%` 
      });
    }
    
    queryBuilder.orderBy('edital.title', 'ASC');
    
    return await paginate<Edital>(queryBuilder, option);
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
