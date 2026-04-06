import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PhoneService } from './phone.service';
import { CreatePhoneDto } from './dto/create-phone.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('telefones')
@Controller('phone')
export class PhoneController {
  constructor(private readonly phoneService: PhoneService) { }

  @Post()
  @ApiOperation({ summary: 'Criar um novo telefone' })
  @ApiResponse({ status: 201, description: 'Telefone criado com sucesso' })
  create(@Body() createPhoneDto: CreatePhoneDto) {
    return this.phoneService.create(createPhoneDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os telefones' })
  @ApiResponse({ status: 200, description: 'Lista de telefones retornada' })
  findAll() {
    return this.phoneService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter um telefone específico' })
  @ApiParam({ name: 'id', description: 'ID do telefone' })
  @ApiResponse({ status: 200, description: 'Detalhes do telefone retornados' })
  findOne(@Param('id') id: string) {
    return this.phoneService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um telefone' })
  @ApiParam({ name: 'id', description: 'ID do telefone' })
  @ApiResponse({ status: 200, description: 'Telefone atualizado com sucesso' })
  update(@Param('id') id: string, @Body() updatePhoneDto: UpdatePhoneDto) {
    return this.phoneService.update(id, updatePhoneDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um telefone' })
  @ApiParam({ name: 'id', description: 'ID do telefone' })
  @ApiResponse({ status: 200, description: 'Telefone removido com sucesso' })
  remove(@Param('id') id: string) {
    return this.phoneService.remove(id);
  }
}
