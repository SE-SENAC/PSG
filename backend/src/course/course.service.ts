import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { statusEnum } from './enum/course-enum';
import { PERIOD_DAY } from './enum/period_day';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) { }

  async confirm(confirmCourseDto: UpdateCourseDto): Promise<UpdateResult> {
    const course = await this.courseRepository.findOne({ where: { id: confirmCourseDto.id } });
    
    if (!course) {
      throw new NotFoundException('Curso não encontrado');
    }

    if (course.status_vacancy === statusEnum.ATIVA) {
      throw new BadRequestException('Curso já confirmado');
    }

    return await this.courseRepository.update(confirmCourseDto.id, {
      status_vacancy: statusEnum.ATIVA,
    });
  }

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    return await this.courseRepository.save(createCourseDto);
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Course>> {
    return await paginate<Course>(this.courseRepository, options, {
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });
  }

  async filter(
    period_day?: PERIOD_DAY,
    categoryId?: string,
    status?: statusEnum,
    search?: string,
    options?: IPaginationOptions,
  ): Promise<Pagination<Course>> {
    const queryBuilder = this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.category', 'category')
      .orderBy('course.createdAt', 'DESC');

    if (period_day !== undefined) {
      queryBuilder.andWhere('course.period_day = :period_day', { period_day });
    }

    if (status !== undefined) {
      queryBuilder.andWhere('course.status_vacancy = :status', { status });
    }

    if (search) {
      queryBuilder.andWhere(
        '(course.title LIKE :search OR course.description LIKE :search OR category.title LIKE :search)',
        { search: `%${search}%` },
      );
    }

    return await paginate(queryBuilder, options || { page: 1, limit: 10 });
  }

  async search(searchText: string, options: IPaginationOptions): Promise<Pagination<Course>> {
    const queryBuilder = this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.category', 'category')
      .orderBy('course.createdAt', 'DESC');

    if (searchText) {
      queryBuilder.andWhere(
        '(course.title LIKE :search OR course.description LIKE :search OR category.title LIKE :search)',
        { search: `%${searchText}%` },
      );
    }

    return await paginate(queryBuilder, options);
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.courseRepository.findOne({ 
        where: { id },
        relations: ['category'] 
    });
    
    if (!course) {
        throw new NotFoundException('Curso não encontrado');
    }
    
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<UpdateResult> {
    const course = await this.findOne(id);
    return await this.courseRepository.update(course.id, updateCourseDto);
  }

  async remove(id: string): Promise<DeleteResult> {
    const course = await this.findOne(id);
    return await this.courseRepository.delete(course.id);
  }
}
