import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TypeUserService } from './type-user.service';
import { CreateTypeUserDto } from './dto/create-type-user.dto';
import { UpdateTypeUserDto } from './dto/update-type-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('tipos-usuarios')
@Controller('type-user')
export class TypeUserController {
  constructor(private readonly typeUserService: TypeUserService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo tipo de usuário' })
  @ApiResponse({
    status: 201,
    description: 'Tipo de usuário criado com sucesso',
  })
  create(@Body() createTypeUserDto: CreateTypeUserDto) {
    return this.typeUserService.create(createTypeUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os tipos de usuários' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de usuários retornada',
  })
  findAll() {
    return this.typeUserService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter um tipo de usuário específico' })
  @ApiParam({ name: 'id', description: 'ID do tipo de usuário' })
  @ApiResponse({
    status: 200,
    description: 'Detalhes do tipo de usuário retornados',
  })
  findOne(@Param('id') id: string) {
    return this.typeUserService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um tipo de usuário' })
  @ApiParam({ name: 'id', description: 'ID do tipo de usuário' })
  @ApiResponse({
    status: 200,
    description: 'Tipo de usuário atualizado com sucesso',
  })
  update(
    @Param('id') id: string,
    @Body() updateTypeUserDto: UpdateTypeUserDto,
  ) {
    return this.typeUserService.update(id, updateTypeUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um tipo de usuário' })
  @ApiParam({ name: 'id', description: 'ID do tipo de usuário' })
  @ApiResponse({
    status: 200,
    description: 'Tipo de usuário removido com sucesso',
  })
  remove(@Param('id') id: string) {
    return this.typeUserService.remove(id);
  }
}
