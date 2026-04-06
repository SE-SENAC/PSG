import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('enderecos')
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo endereço' })
  @ApiResponse({ status: 201, description: 'Endereço criado com sucesso' })
  create(@Body() createAddressDto: CreateAddressDto) {
    return this.addressService.create(createAddressDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os endereços' })
  @ApiResponse({ status: 200, description: 'Lista de endereços retornada' })
  findAll() {
    return this.addressService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter um endereço específico' })
  @ApiParam({ name: 'id', description: 'ID do endereço' })
  @ApiResponse({ status: 200, description: 'Detalhes do endereço retornados' })
  findOne(@Param('id') id: string) {
    return this.addressService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um endereço' })
  @ApiParam({ name: 'id', description: 'ID do endereço' })
  @ApiResponse({ status: 200, description: 'Endereço atualizado com sucesso' })
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.update(id, updateAddressDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um endereço' })
  @ApiParam({ name: 'id', description: 'ID do endereço' })
  @ApiResponse({ status: 200, description: 'Endereço removido com sucesso' })
  remove(@Param('id') id: string) {
    return this.addressService.remove(id);
  }
}
