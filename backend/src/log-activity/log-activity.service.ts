import { Injectable } from '@nestjs/common';
import { CreateLogActivityDto } from './dto/create-log-activity.dto';
import { UpdateLogActivityDto } from './dto/update-log-activity.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LogActivity } from './entities/log-activity.entity';
import { Repository } from 'typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class LogActivityService {
  constructor(
    @InjectRepository(LogActivity)
    private readonly logActivityRepository: Repository<LogActivity>,
  ) {}

  create(createLogActivityDto: CreateLogActivityDto) {
    return this.logActivityRepository.save(createLogActivityDto);
  }

  async findAll(options: IPaginationOptions, filters: { search?: string; method?: string; period?: string }): Promise<Pagination<LogActivity>> {
    const queryBuilder = this.logActivityRepository.createQueryBuilder('log')
      .leftJoinAndSelect('log.user', 'user');

    if (filters.search) {
      queryBuilder.andWhere(
        '(log.activity LIKE :search OR user.name LIKE :search OR user.email LIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    if (filters.method && filters.method !== 'all') {
      queryBuilder.andWhere('log.method = :method', { method: filters.method });
    }

    if (filters.period && filters.period !== 'all') {
      const now = new Date();
      let startDate: Date | null = null;
      
      switch (filters.period) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
      }
      
      if (startDate) {
        queryBuilder.andWhere('log.created_at >= :startDate', { startDate });
      }
    }

    queryBuilder.orderBy('log.created_at', 'DESC');

    return paginate<LogActivity>(queryBuilder, options);
  }

  findOne(id: string) {
    return this.logActivityRepository.findOne({ 
      where: { id },
      relations: ['user']
    });
  }

  update(id: string, updateLogActivityDto: UpdateLogActivityDto) {
    return this.logActivityRepository.update(id, updateLogActivityDto);
  }

  remove(id: string) {
    return this.logActivityRepository.delete(id);
  }
}
