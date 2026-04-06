import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os administradores' })
  @ApiResponse({
    status: 200,
    description: 'Lista de administradores retornada',
  })
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter um administrador específico' })
  @ApiParam({ name: 'id', description: 'ID do administrador' })
  @ApiResponse({
    status: 200,
    description: 'Detalhes do administrador retornados',
  })
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @Post('create-scratch')
  @ApiOperation({ summary: 'Criar um administrador do zero' })
  @ApiResponse({
    status: 201,
    description: 'Administrador criado com sucesso',
  })
  createScratch(@Body() data: any) {
    return this.adminService.createAdminFromScratch(data);
  }

  @Post('find-by-email')
  @ApiOperation({ summary: 'Encontrar um administrador por email' })
  @ApiResponse({
    status: 200,
    description: 'Administrador encontrado com sucesso',
  })
  findOneByEmail(@Body() data: any) {
    return this.adminService.findOneByEmail(data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um administrador' })
  @ApiParam({ name: 'id', description: 'ID do administrador' })
  @ApiResponse({
    status: 200,
    description: 'Administrador removido com sucesso',
  })
  remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }
}
