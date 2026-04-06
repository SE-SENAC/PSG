import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { statusEnum } from './enum/course-enum';
import { PERIOD_DAY } from './enum/period_day';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Course } from './entities/course.entity';
import { UpdateResult, DeleteResult } from 'typeorm';

@ApiTags('cursos')
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo curso' })
  @ApiResponse({ status: 201, description: 'Curso criado com sucesso' })
  async create(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
    return this.courseService.create(createCourseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os cursos com paginação' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Lista de cursos retornada' })
  async index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Course>> {
    const safeLimit = limit > 100 ? 100 : limit;
    return this.courseService.findAll({ page, limit: safeLimit, route: '/course' });
  }

  @Get('filter')
  @ApiOperation({ summary: 'Filtrar cursos por diversos critérios' })
  @ApiQuery({ name: 'period_day', enum: PERIOD_DAY, required: false })
  @ApiQuery({ name: 'categoryId', type: String, required: false })
  @ApiQuery({ name: 'status', enum: statusEnum, required: false })
  @ApiQuery({ name: 'title', type: String, required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Cursos filtrados retornados' })
  async filter(
    @Query('period_day') period_day?: PERIOD_DAY,
    @Query('categoryId') categoryId?: string,
    @Query('status') status?: statusEnum,
    @Query('title') title?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Course>> {
    return this.courseService.filter(period_day, categoryId, status, title, {
      page,
      limit,
    });
  }

  @Get('search')
  @ApiOperation({ summary: 'Pesquisar cursos por texto' })
  @ApiQuery({ name: 'search', type: String, required: true })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Resultados da pesquisa retornados',
  })
  async search(
    @Query('search') search: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Course>> {
    return this.courseService.search(search, { page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de um curso específico' })
  @ApiParam({ name: 'id', description: 'ID do curso' })
  @ApiResponse({ status: 200, description: 'Detalhes do curso retornados' })
  async findOne(@Param('id') id: string): Promise<Course> {
    return this.courseService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados de um curso' })
  @ApiParam({ name: 'id', description: 'ID do curso' })
  @ApiResponse({ status: 200, description: 'Curso atualizado com sucesso' })
  async update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto): Promise<UpdateResult> {
    return this.courseService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um curso' })
  @ApiParam({ name: 'id', description: 'ID do curso' })
  @ApiResponse({ status: 200, description: 'Curso removido com sucesso' })
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.courseService.remove(id);
  }
}
