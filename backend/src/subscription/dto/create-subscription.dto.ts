import { IsEnum, IsString } from 'class-validator';
import { STATUS } from '../enum/status';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionDto {
  @ApiProperty({ enum: STATUS, description: 'Status da inscrição' })
  @IsEnum(STATUS)
  status: STATUS;

  @ApiProperty({ description: 'ID do curso' })
  @IsString()
  course_id: string;

  @ApiProperty({ description: 'ID do estudante' })
  @IsString()
  student_id: string;
}
