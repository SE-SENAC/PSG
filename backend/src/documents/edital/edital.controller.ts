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
} from '@nestjs/common';
import { EditalService } from './edital.service';
import { CreateEditalDto } from './dto/create-edital.dto';
import { UpdateEditalDto } from './dto/update-edital.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('editais')
@Controller('edital')
export class EditalController {
  constructor(private readonly editalService: EditalService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo edital' })
  @ApiResponse({ status: 201, description: 'Edital criado com sucesso' })
  create(@Body() createEditalDto: CreateEditalDto) {
    return this.editalService.create(createEditalDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os editais com paginação' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Lista de editais retornada' })
  index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('search') search?: string,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.editalService.findAll({ page, limit, route: '/edital' }, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter um edital específico' })
  @ApiParam({ name: 'id', description: 'ID do edital' })
  @ApiResponse({ status: 200, description: 'Detalhes do edital retornados' })
  findOne(@Param('id') id: string) {
    return this.editalService.findOne(id);
  }

  @Put(':id')
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um edital' })
  @ApiParam({ name: 'id', description: 'ID do edital' })
  @ApiResponse({ status: 200, description: 'Edital atualizado com sucesso' })
  update(@Param('id') id: string, @Body() updateEditalDto: UpdateEditalDto) {
    return this.editalService.update(id, updateEditalDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um edital' })
  @ApiParam({ name: 'id', description: 'ID do edital' })
  @ApiResponse({ status: 200, description: 'Edital removido com sucesso' })
  remove(@Param('id') id: string) {
    return this.editalService.remove(id);
  }
}
