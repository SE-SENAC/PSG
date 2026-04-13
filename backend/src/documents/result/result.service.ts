import { Injectable } from '@nestjs/common';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Result } from './entities/result.entity';
import { Repository } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class ResultService {
  constructor(
    @InjectRepository(Result) private resultRepository: Repository<Result>,
  ) {}

  async create(createResultDto: CreateResultDto) {
    return await this.resultRepository.save(createResultDto);
  }

  async findAll(option: IPaginationOptions, search?: string): Promise<Pagination<Result>> {
    const queryBuilder = this.resultRepository.createQueryBuilder('result');
    
    if (search) {
      queryBuilder.where('result.title LIKE :search OR result.code LIKE :search', { 
        search: `%${search}%` 
      });
    }
    
    queryBuilder.orderBy('result.title', 'ASC');
    
    return await paginate<Result>(queryBuilder, option);
  }

  async findOne(id: string) {
    return await this.resultRepository.findOne({ where: { id } });
  }

  async update(id: string, updateResultDto: UpdateResultDto) {
    return await this.resultRepository.update(id, updateResultDto);
  }

  async remove(id: string) {
    return await this.resultRepository.delete(id);
  }
}
