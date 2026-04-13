import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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
import { COURSE_TYPE } from './enum/course-type';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  /**
   * Confirma a ativação de um curso, alterando seu status para ATIVA.
   * @param confirmCourseDto DTO contendo o ID do curso a ser confirmado.
   * @returns Resultado da operação de atualização.
   */
  async confirm(confirmCourseDto: UpdateCourseDto): Promise<UpdateResult> {
    const course = await this.courseRepository.findOne({
      where: { id: confirmCourseDto.id },
    });

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

  /**
   * Cria um novo curso no banco de dados.
   * @param createCourseDto Dados para a criação do curso.
   * @returns O curso criado.
   */
  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    return await this.courseRepository.save(createCourseDto);
  }

  /**
   * Retorna todos os cursos com paginação.
   * @param options Opções de paginação (página, limite).
   * @returns Objeto de paginação contendo a lista de cursos.
   */
  async findAll(options: IPaginationOptions): Promise<Pagination<Course>> {
    return await paginate<Course>(this.courseRepository, options, {
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Filtra cursos baseando-se em múltiplos critérios (período, categoria, status, busca).
   * @param period_day Período do dia (Manhã, Tarde, Noite).
   * @param categoryId ID da categoria.
   * @param status Status da vaga (Ativa, Inativa).
   * @param search Termo de busca para título, descrição ou categoria.
   * @param options Opções de paginação.
   * @returns Cursos filtrados e paginados.
   */
  async filter(
    period_day?: PERIOD_DAY,
    categoryId?: string,
    status?: statusEnum,
    search?: string,
    municipality?: string,
    type?: COURSE_TYPE,
    options?: IPaginationOptions,
  ): Promise<Pagination<Course>> {
    const queryBuilder = this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.category', 'category')
      .orderBy('course.createdAt', 'DESC');

    if (period_day) {
      queryBuilder.andWhere('course.period_day = :period_day', { period_day });
    }

    if (type) {
      queryBuilder.andWhere('course.type = :type', { type });
    }

    if (categoryId) {
      queryBuilder.andWhere('course.categoryId = :categoryId', { categoryId });
    }

    if (status !== undefined && status !== null) {
      queryBuilder.andWhere('course.status_vacancy = :status', { status });
    }

    if (municipality) {
      queryBuilder.andWhere('course.municipality = :municipality', {
        municipality,
      });
    }

    if (search) {
      queryBuilder.andWhere(
        '(course.title LIKE :search OR course.description LIKE :search OR category.title LIKE :search OR course.municipality LIKE :search)',
        { search: `%${search}%` },
      );
    }

    return await paginate(queryBuilder, options || { page: 1, limit: 10 });
  }

  /**
   * Pesquisa cursos por um texto genérico em vários campos.
   * @param searchText Texto a ser pesquisado.
   * @param options Opções de paginação.
   * @returns Resultados da pesquisa paginados.
   */
  async search(
    searchText: string,
    options: IPaginationOptions,
  ): Promise<Pagination<Course>> {
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

  /**
   * Busca um curso específico pelo ID.
   * @param id ID único do curso.
   * @returns O curso encontrado ou lança exceção se não existir.
   */
  async findOne(id: string): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!course) {
      throw new NotFoundException('Curso não encontrado');
    }

    return course;
  }

  /**
   * Atualiza os dados de um curso existente.
   * @param id ID do curso.
   * @param updateCourseDto Novos dados para o curso.
   * @returns Resultado da atualização.
   */
  async update(
    id: string,
    updateCourseDto: UpdateCourseDto,
  ): Promise<UpdateResult> {
    const course = await this.findOne(id);
    return await this.courseRepository.update(course.id, updateCourseDto);
  }

  /**
   * Remove um curso do sistema.
   * @param id ID do curso a ser removido.
   * @returns Resultado da exclusão.
   */
  async remove(id: string): Promise<DeleteResult> {
    const course = await this.findOne(id);
    return await this.courseRepository.delete(course.id);
  }
}
