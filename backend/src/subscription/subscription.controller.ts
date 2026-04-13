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
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Subscription } from './entities/subscription.entity';
import { UpdateResult, DeleteResult } from 'typeorm';

@ApiTags('inscricoes')
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova inscrição' })
  @ApiResponse({ status: 201, description: 'Inscrição realizada com sucesso' })
  async create(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
    @Body('user_id') user_id: string,
    @Body('course_id') course_id: string,
  ): Promise<Subscription> {
    return this.subscriptionService.create(
      user_id,
      course_id,
      createSubscriptionDto,
    );
  }

  @Post('confirm/:id')
  @ApiOperation({ summary: 'Confirmar uma inscrição' })
  @ApiParam({ name: 'id', description: 'ID da inscrição' })
  @ApiResponse({ status: 200, description: 'Inscrição confirmada com sucesso' })
  async confirm(@Param('id') id: string): Promise<Subscription> {
    return this.subscriptionService.confirm(id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as inscrições com paginação e busca' })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('search') search?: string,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.subscriptionService.findAll({ page, limit, route: '/subscription' }, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter uma inscrição específica' })
  @ApiParam({ name: 'id', description: 'ID da inscrição' })
  @ApiResponse({ status: 200, description: 'Detalhes da inscrição retornados' })
  async findOne(@Param('id') id: string): Promise<Subscription> {
    return this.subscriptionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma inscrição' })
  @ApiParam({ name: 'id', description: 'ID da inscrição' })
  @ApiResponse({ status: 200, description: 'Inscrição atualizada com sucesso' })
  async update(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<UpdateResult> {
    return this.subscriptionService.update(id, updateSubscriptionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma inscrição' })
  @ApiParam({ name: 'id', description: 'ID da inscrição' })
  @ApiResponse({ status: 200, description: 'Inscrição removida com sucesso' })
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.subscriptionService.remove(id);
  }
}
