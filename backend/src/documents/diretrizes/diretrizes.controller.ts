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
import { DiretrizesService } from './diretrizes.service';
import { CreateDiretrizDto } from './dto/create-diretriz.dto';
import { UpdateDiretrizDto } from './dto/update-diretriz.dto';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

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
    return this.diretrizesService.findAll(
      { page, limit, route: '/diretrizes' },
      search,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter uma diretriz específica' })
  findOne(@Param('id') id: string) {
    return this.diretrizesService.findOne(id);
  }

  @Put(':id')
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma diretriz' })
  @ApiParam({ name: 'id', description: 'ID da diretriz' })
  @ApiResponse({ status: 200, description: 'Diretriz atualizada com sucesso' })
  update(
    @Param('id') id: string,
    @Body() updateDiretrizDto: UpdateDiretrizDto,
  ) {
    return this.diretrizesService.update(id, updateDiretrizDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma diretriz' })
  remove(@Param('id') id: string) {
    return this.diretrizesService.remove(id);
  }
}
