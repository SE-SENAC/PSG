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
import { SuperAdminService } from './super-admin.service';
import { CreateSuperAdminDto } from './dto/create-super-admin.dto';
import { UpdateSuperAdminDto } from './dto/update-super-admin.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

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

  @Get('dashboard/stats')
  @ApiOperation({ summary: 'Obter estatísticas do dashboard' })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas retornadas com sucesso',
  })
  getStats() {
    return this.superAdminService.getDashboardStats();
  }

  @Get('admins')
  @ApiOperation({ summary: 'Listar todos os administradores com paginação' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  async listAdmins(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('search') search?: string,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.superAdminService.listAdmins({ page, limit }, search);
  }

  @Post('admins')
  @ApiOperation({ summary: 'Criar um novo administrador' })
  @ApiResponse({
    status: 201,
    description: 'Administrador criado com sucesso',
  })
  createAdmin(@Body() createAdminDto: any) {
    return this.superAdminService.createAdmin(createAdminDto);
  }

  @Patch('admins/:userId/status')
  @ApiOperation({ summary: 'Ativar/Desativar um administrador' })
  @ApiParam({ name: 'userId', description: 'ID do usuário administrador' })
  @ApiResponse({
    status: 200,
    description: 'Status do administrador atualizado',
  })
  toggleAdminStatus(
    @Param('userId') userId: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.superAdminService.setAdminStatus(userId, isActive);
  }

  @Get('admins/:userId')
  @ApiOperation({ summary: 'Obter um administrador pelo ID' })
  @ApiParam({ name: 'userId', description: 'ID do usuário administrador' })
  @ApiResponse({
    status: 200,
    description: 'Detalhes do administrador retornados',
  })
  getAdmin(@Param('userId') userId: string) {
    return this.superAdminService.getAdmin(userId);
  }

  @Delete('admins/:userId')
  @ApiOperation({ summary: 'Remover um administrador' })
  @ApiParam({ name: 'userId', description: 'ID do usuário administrador' })
  @ApiResponse({
    status: 200,
    description: 'Administrador removido com sucesso',
  })
  removeAdmin(@Param('userId') userId: string) {
    return this.superAdminService.removeAdmin(userId);
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
