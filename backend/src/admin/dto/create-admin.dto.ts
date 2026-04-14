import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
  @ApiProperty({ example: 'Admin Example' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'admin@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SenhaForte@123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;
}

