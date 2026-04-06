import { IsEnum } from 'class-validator';
import { ROLE } from '../enum/enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTypeUserDto {
  @ApiProperty({ enum: ROLE, description: 'Papel do usuário' })
  @IsEnum(ROLE)
  role: ROLE;
}
