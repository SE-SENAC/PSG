import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiProperty({ example: '01001-000', description: 'CEP' })
  @IsString()
  zipCode: string;

  @ApiProperty({ example: '123', description: 'Número da residência' })
  @IsString()
  residence_number: string;

  @ApiProperty({ example: 'Rua das Flores', description: 'Logradouro' })
  @IsString()
  street: string;

  @ApiProperty({ example: 'Apto 101', description: 'Complemento' })
  @IsString()
  complement: string;

  @ApiProperty({ example: 'Centro', description: 'Bairro' })
  @IsString()
  neighborhood: string;

  @ApiProperty({ example: 'São Paulo', description: 'Cidade' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'SP', description: 'Estado' })
  @IsString()
  state: string;

  @ApiProperty({ example: 'Brasil', description: 'País' })
  @IsString()
  country: string;
}
