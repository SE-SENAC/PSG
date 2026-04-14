import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CompressedCacheInterceptor } from '../common/interceptors/compressed-cache.interceptor';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { UploadImageDto, ImageUrlResponseDto } from './dto/upload-image.dto';
import { statusEnum } from './enum/course-enum';
import { PERIOD_DAY } from './enum/period_day';
import { COURSE_TYPE } from './enum/course-type';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiConsumes,
} from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Course } from './entities/course.entity';
import { UpdateResult, DeleteResult } from 'typeorm';
import { FileUploadService } from '../common/services/file-upload.service';

@ApiTags('cursos')
@Controller('course')
@UseInterceptors(CompressedCacheInterceptor)
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  /**
   * Endpoint para criar um novo curso.
   * @param createCourseDto Objeto com os dados do curso.
   * @returns O curso criado.
   */
  @Post()
  @ApiOperation({ summary: 'Criar um novo curso' })
  @ApiResponse({ status: 201, description: 'Curso criado com sucesso' })
  async create(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
    return this.courseService.create(createCourseDto);
  }

  /**
   * Endpoint para fazer upload de imagem do curso.
   * @param file Arquivo de imagem a ser enviado.
   * @returns URL da imagem enviada.
   */
  @Post('upload/image')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Fazer upload de imagem para um curso' })
  @ApiResponse({
    status: 201,
    description: 'Imagem enviada com sucesso',
    type: ImageUrlResponseDto,
  })
  @UseInterceptors(
    FileInterceptor('file', new FileUploadService().getImageUploadConfig()),
  )
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ImageUrlResponseDto> {
    const img_url = this.fileUploadService.processImageUpload(file);
    return { img_url };
  }

  /**
   * Endpoint para listar cursos paginados.
   * @param page Número da página (padrão 1).
   * @param limit Itens por página (padrão 10).
   * @returns Lista paginada de cursos.
   */
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
    return this.courseService.findAll({
      page,
      limit: safeLimit,
      route: '/course',
    });
  }

  /**
   * Endpoint para filtrar cursos baseado em critérios específicos.
   * @param period_day Turno do curso.
   * @param categoryId Filtro por categoria.
   * @param status Filtro por status de vaga.
   * @param title Busca por título.
   * @param page Página atual.
   * @param limit Limite por página.
   * @returns Cursos filtrados.
   */
  @Get('filter')
  @ApiOperation({ summary: 'Filtrar cursos por diversos critérios' })
  @ApiQuery({ name: 'period_day', enum: PERIOD_DAY, required: false })
  @ApiQuery({ name: 'categoryId', type: String, required: false })
  @ApiQuery({ name: 'status', enum: statusEnum, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  @ApiQuery({ name: 'municipality', type: String, required: false })
  @ApiQuery({ name: 'type', enum: COURSE_TYPE, required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Cursos filtrados retornados' })
  async filter(
    @Query('period_day') period_day?: PERIOD_DAY,
    @Query('categoryId') categoryId?: string,
    @Query('status', new ParseIntPipe({ optional: true })) status?: statusEnum,
    @Query('search') search?: string,
    @Query('municipality') municipality?: string,
    @Query('type') type?: COURSE_TYPE,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Course>> {
    return this.courseService.filter(
      period_day,
      categoryId,
      status,
      search,
      municipality,
      type,
      {
        page,
        limit,
      },
    );
  }

  /**
   * Endpoint de busca global de cursos.
   * @param search Texto para busca.
   * @param page Página atual.
   * @param limit Limite por página.
   * @returns Resultados da busca.
   */
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

  /**
   * Endpoint para obter detalhes de um curso pelo seu ID.
   * @param id ID do curso.
   * @returns Dados do curso.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de um curso específico' })
  @ApiParam({ name: 'id', description: 'ID do curso' })
  @ApiResponse({ status: 200, description: 'Detalhes do curso retornados' })
  async findOne(@Param('id') id: string): Promise<Course> {
    return this.courseService.findOne(id);
  }

  /**
   * Endpoint para atualizar um curso.
   * @param id ID do curso.
   * @param updateCourseDto Dados a serem atualizados.
   * @returns Resultado da atualização.
   */
  @Put(':id')
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados de um curso' })
  @ApiParam({ name: 'id', description: 'ID do curso' })
  @ApiResponse({ status: 200, description: 'Curso atualizado com sucesso' })
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ): Promise<UpdateResult> {
    return this.courseService.update(id, updateCourseDto);
  }

  /**
   * Endpoint para deletar um curso.
   * @param id ID do curso.
   * @returns Resultado da exclusão.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Remover um curso' })
  @ApiParam({ name: 'id', description: 'ID do curso' })
  @ApiResponse({ status: 200, description: 'Curso removido com sucesso' })
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.courseService.remove(id);
  }
}
