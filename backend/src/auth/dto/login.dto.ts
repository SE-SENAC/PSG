import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class LoginDto {
  @ApiProperty({
    example: 'usuario@senac.com.br',
    description: 'E-mail do usuário',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'senha123', description: 'Senha do usuário' })
  @IsString()
  password: string;
}
