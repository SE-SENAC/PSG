import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { CreateSuperAdminDto } from './dto/create-super-admin.dto';
import { UpdateSuperAdminDto } from './dto/update-super-admin.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('super-admin')
@Controller('super-admin')
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os super administradores' })
  @ApiResponse({
    status: 200,
    description: 'Lista de super administradores retornada',
  })
  findAll() {
    return this.superAdminService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter um super administrador específico' })
  @ApiParam({ name: 'id', description: 'ID do super administrador' })
  @ApiResponse({
    status: 200,
    description: 'Detalhes do super administrador retornados',
  })
  findOne(@Param('id') id: string) {
    return this.superAdminService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um super administrador' })
  @ApiParam({ name: 'id', description: 'ID do super administrador' })
  @ApiResponse({
    status: 200,
    description: 'Super administrador removido com sucesso',
  })
  remove(@Param('id') id: string) {
    return this.superAdminService.remove(id);
  }
}
