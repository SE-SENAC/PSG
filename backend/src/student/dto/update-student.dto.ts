import { PartialType } from '@nestjs/swagger';
import CreateStudentDto from './create-student.dto';
import { IsString } from 'class-validator';

export class UpdateStudentDto extends PartialType(CreateStudentDto) {
  @IsString()
  id: string;
}
