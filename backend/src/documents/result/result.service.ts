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

  async findAll(option: IPaginationOptions): Promise<Pagination<Result>> {
    return await paginate<Result>(this.resultRepository, option, {
      order: { title: 'ASC' },
    });
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
