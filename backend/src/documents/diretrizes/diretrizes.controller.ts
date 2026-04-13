import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { DiretrizesService } from './diretrizes.service';
import { CreateDiretrizDto } from './dto/create-diretriz.dto';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('diretrizes')
@Controller('diretrizes')
export class DiretrizesController {
  constructor(private readonly diretrizesService: DiretrizesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova diretriz' })
  create(@Body() createDiretrizDto: CreateDiretrizDto) {
    return this.diretrizesService.create(createDiretrizDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as diretrizes' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('search') search?: string,
  ) {
    return this.diretrizesService.findAll({ page, limit, route: '/diretrizes' }, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.diretrizesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.diretrizesService.remove(id);
  }
}
