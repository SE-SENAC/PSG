import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDiretrizDto {
  @ApiProperty({ example: 'Diretrizes 2026', description: 'Título da diretriz' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Arquivo em Base64 ou caminho do arquivo',
  })
  @IsNotEmpty()
  @IsString()
  file_path: string;

  @ApiProperty({ default: true })
  @IsBoolean()
  active: boolean;
}
