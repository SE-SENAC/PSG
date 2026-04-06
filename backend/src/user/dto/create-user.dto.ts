import { IsNumber, IsDate, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'João Silva', description: 'Nome completo' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'joao@example.com',
    description: 'E-mail do usuário',
  })
  @IsString()
  email: string;

  @ApiProperty({ example: '1990-01-01', description: 'Data de nascimento' })
  @IsDate()
  birth_date: Date;

  @ApiProperty({ example: 'senha123', description: 'Senha de acesso' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'Data de criação' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização' })
  @IsDate()
  updatedAt: Date;
}
