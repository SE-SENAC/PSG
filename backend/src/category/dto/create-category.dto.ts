import { IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Tecnologia', description: 'Título da categoria' })
  @IsString()
  title: string;

  @ApiProperty({ example: true, description: 'Se a categoria está ativa' })
  @IsBoolean()
  isActive: boolean;
}
