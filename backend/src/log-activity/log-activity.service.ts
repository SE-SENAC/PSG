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

  async findAll(
    options: IPaginationOptions, 
    filters: { 
      search?: string; 
      method?: string; 
      period?: string;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<Pagination<LogActivity>> {
    const queryBuilder = this.logActivityRepository.createQueryBuilder('log')
      .leftJoinAndSelect('log.user', 'user');

    if (filters.search) {
      queryBuilder.andWhere(
        '(log.activity LIKE :search OR user.name LIKE :search OR user.email LIKE :search OR log.ip LIKE :search OR log.page_route LIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    if (filters.method && filters.method !== 'all') {
      queryBuilder.andWhere('log.method = :method', { method: filters.method.toUpperCase() });
    }

    // Date Range filtering (Calendar)
    if (filters.startDate) {
      const start = new Date(filters.startDate);
      start.setHours(0, 0, 0, 0);
      queryBuilder.andWhere('log.created_at >= :start', { start });
    }

    if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      queryBuilder.andWhere('log.created_at <= :end', { end });
    }

    // Period filtering (Quick filters)
    if (filters.period && filters.period !== 'all' && !filters.startDate) {
      const now = new Date();
      let periodStart: Date | null = null;
      
      switch (filters.period) {
        case 'today':
        case '24h':
          periodStart = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
        case '7d':
          periodStart = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
        case '30d':
          periodStart = new Date(now.setMonth(now.getMonth() - 1));
          break;
      }
      
      if (periodStart) {
        queryBuilder.andWhere('log.created_at >= :periodStart', { periodStart });
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
