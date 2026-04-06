import {
  IsString,
  IsNumber,
  IsDate,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { statusEnum } from '../enum/course-enum';
import { PERIOD_DAY } from '../enum/period_day';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({ description: 'URL da imagem do curso' })
  @IsString()
  img_url: string;

  @ApiProperty({ description: 'Título do curso' })
  @IsString()
  title: string;

  @ApiProperty({ enum: statusEnum, description: 'Status das vagas' })
  @IsEnum(statusEnum)
  status_vacancy: statusEnum;

  @ApiProperty({ description: 'Endereço do curso' })
  @IsString()
  address: string;

  @ApiProperty({ description: 'Público alvo' })
  @IsString()
  targetAudience: string;

  @ApiProperty({ description: 'Idade mínima' })
  @IsNumber()
  minAge: number;

  @ApiProperty({ description: 'Dias de aula' })
  @IsString()
  schooldays: string;

  @ApiProperty({ description: 'Carga horária' })
  @IsNumber()
  workload: number;

  @ApiProperty({ description: 'Escolaridade mínima' })
  @IsString()
  minimumEducation: string;

  @ApiProperty({ description: 'Descrição do curso' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Código do curso' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Vagas disponíveis' })
  @IsNumber()
  availablePosition: number;

  @ApiProperty({ description: 'Início do período de aulas' })
  @IsDate()
  classPeriodStart: Date;

  @ApiProperty({ description: 'Fim do período de aulas' })
  @IsDate()
  classPeriodEnd: Date;

  @ApiProperty({ description: 'Início das inscrições' })
  @IsDate()
  subscriptionStartDate: Date;

  @ApiProperty({ description: 'Fim das inscrições' })
  @IsDate()
  subscriptionEndDate: Date;

  @ApiProperty({ description: 'Data de início do curso' })
  @IsDate()
  courseStart: Date;

  @ApiProperty({ description: 'Data de término do curso' })
  @IsDate()
  courseEnd: Date;

  @ApiProperty({ description: 'Data de criação' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização' })
  @IsDate()
  updatedAt: Date;

  @ApiProperty({ enum: PERIOD_DAY, description: 'Período do dia' })
  @IsEnum(PERIOD_DAY)
  period_day: PERIOD_DAY;
}
