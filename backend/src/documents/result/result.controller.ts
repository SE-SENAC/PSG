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
import { ResultService } from './result.service';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('resultados')
@Controller('results')
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo resultado' })
  @ApiResponse({ status: 201, description: 'Resultado criado com sucesso' })
  create(@Body() createResultDto: CreateResultDto) {
    return this.resultService.create(createResultDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os resultados com paginação' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Lista de resultados retornada' })
  index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('search') search?: string,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.resultService.findAll(
      { page, limit, route: '/result' },
      search,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter um resultado específico' })
  @ApiParam({ name: 'id', description: 'ID do resultado' })
  @ApiResponse({ status: 200, description: 'Detalhes do resultado retornados' })
  findOne(@Param('id') id: string) {
    return this.resultService.findOne(id);
  }

  @Put(':id')
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um resultado' })
  @ApiParam({ name: 'id', description: 'ID do resultado' })
  @ApiResponse({ status: 200, description: 'Resultado atualizado com sucesso' })
  update(@Param('id') id: string, @Body() updateResultDto: UpdateResultDto) {
    return this.resultService.update(id, updateResultDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um resultado' })
  @ApiParam({ name: 'id', description: 'ID do resultado' })
  @ApiResponse({ status: 200, description: 'Resultado removido com sucesso' })
  remove(@Param('id') id: string) {
    return this.resultService.remove(id);
  }
}
