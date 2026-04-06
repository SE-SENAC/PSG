import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateResultDto {
  @ApiProperty({ example: 'RES001', description: 'Código do resultado' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({
    example: 'Resultado Final 2026',
    description: 'Título do resultado',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'uploads/resultado_final.pdf',
    description: 'Caminho do arquivo do resultado',
  })
  @IsNotEmpty()
  @IsString()
  file_path: string;
}
