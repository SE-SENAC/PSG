import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StudentService } from './student.service';
import CreateStudentDto from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('estudantes')
@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo estudante' })
  @ApiResponse({ status: 201, description: 'Estudante criado com sucesso' })
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os estudantes' })
  @ApiResponse({ status: 200, description: 'Lista de estudantes retornada' })
  findAll() {
    return this.studentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter um estudante específico' })
  @ApiParam({ name: 'id', description: 'ID do estudante' })
  @ApiResponse({ status: 200, description: 'Detalhes do estudante retornados' })
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um estudante' })
  @ApiParam({ name: 'id', description: 'ID do estudante' })
  @ApiResponse({ status: 200, description: 'Estudante atualizado com sucesso' })
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um estudante' })
  @ApiParam({ name: 'id', description: 'ID do estudante' })
  @ApiResponse({ status: 200, description: 'Estudante removido com sucesso' })
  remove(@Param('id') id: string) {
    return this.studentService.remove(id);
  }
}
