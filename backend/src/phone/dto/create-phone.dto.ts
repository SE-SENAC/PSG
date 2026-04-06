import { IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePhoneDto {
  @ApiProperty({ example: '11', description: 'DDD' })
  @IsString()
  ddd: string;

  @ApiProperty({ example: '55', description: 'DDI' })
  @IsString()
  ddi: string;

  @ApiProperty({ example: '99999-9999', description: 'Número do telefone' })
  @IsString()
  number: string;
}
