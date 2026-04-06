import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEditalDto {
  @ApiProperty({ example: 'Edital 001/2026', description: 'Título do edital' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'uploads/edital_001.pdf',
    description: 'Caminho do arquivo do edital',
  })
  @IsNotEmpty()
  @IsString()
  file_path: string;

  @ApiProperty({ description: 'Data de criação' })
  @IsNotEmpty()
  @IsString()
  created_at: Date;

  @ApiProperty({ description: 'Data de atualização' })
  @IsNotEmpty()
  @IsString()
  updated_at: Date;
}
