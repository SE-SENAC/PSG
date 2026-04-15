import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    example: '3c59dc04-8e88-5024-3be8-079a5c74d079',
    description: 'ID da categoria',
    required: false,
  })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiProperty({ example: 'Tecnologia', description: 'Título da categoria' })
  @IsString()
  title: string;

  @ApiProperty({ example: true, description: 'Se a categoria está ativa' })
  @IsBoolean()
  isActive: boolean;
}
