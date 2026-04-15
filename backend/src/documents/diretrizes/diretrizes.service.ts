import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Diretriz } from './entities/diretriz.entity';
import { CreateDiretrizDto } from './dto/create-diretriz.dto';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class DiretrizesService {
  constructor(
    @InjectRepository(Diretriz)
    private readonly diretrizRepository: Repository<Diretriz>,
  ) {}

  async create(createDiretrizDto: CreateDiretrizDto) {
    return await this.diretrizRepository.save(createDiretrizDto);
  }

  async findAll(
    options: IPaginationOptions,
    search?: string,
  ): Promise<Pagination<Diretriz>> {
    const queryBuilder = this.diretrizRepository.createQueryBuilder('diretriz');

    // Filtrar apenas diretrizes ativas
    queryBuilder.where('diretriz.active = :active', { active: true });

    if (search) {
      queryBuilder.andWhere('diretriz.title LIKE :search', {
        search: `%${search}%`,
      });
    }

    queryBuilder.orderBy('diretriz.created_at', 'DESC');

    return await paginate<Diretriz>(queryBuilder, options);
  }

  async findOne(id: string) {
    return await this.diretrizRepository.findOne({ where: { id } });
  }

  async update(id: string, updateDiretrizDto: any) {
    return await this.diretrizRepository.update(id, updateDiretrizDto);
  }

  async remove(id: string) {
    return await this.diretrizRepository.delete(id);
  }
}
