import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsString,
  IsObject,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Gender } from 'src/commons/gender';
import { IS_PCD, PCD_TYPE } from 'src/commons/pcd';
import { CreateAddressDto } from 'src/address/dto/create-address.dto';
import { CreatePhoneDto } from 'src/phone/dto/create-phone.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EDUCATION_LEVEL } from 'src/student/enum/education_level';

export default class RegisterDto {
  @ApiProperty({ example: 'João Silva', description: 'Nome completo' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'joao@example.com',
    description: 'E-mail do usuário',
  })
  @IsString()
  email: string;

  @ApiProperty({ example: 'senha123', description: 'Senha de acesso' })
  @IsString()
  password: string;

  @ApiProperty({ example: '123.456.789-00', description: 'CPF do usuário' })
  @IsString()
  cpf: string;

  @ApiProperty({ enum: Gender, description: 'Gênero' })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ enum: IS_PCD, description: 'É PCD?' })
  @IsEnum(IS_PCD)
  is_pcd: IS_PCD;

  @ApiPropertyOptional({ enum: PCD_TYPE, description: 'Tipo de deficiência' })
  @IsOptional()
  @IsEnum(PCD_TYPE)
  pcd_type?: PCD_TYPE;

  @ApiProperty({ description: 'Nome da mãe' })
  @IsString()
  mother_name: string;

  @ApiProperty({ description: 'Nome do pai' })
  @IsString()
  father_name: string;

  @ApiPropertyOptional({ description: 'Número de dependentes em casa' })
  @IsOptional()
  number_parents_in_home: number;

  @ApiProperty({ example: '1990-01-01', description: 'Data de nascimento' })
  @IsString()
  birth_date: string;

  @ApiPropertyOptional({ description: 'Renda pessoal' })
  @IsOptional()
  personal_income: number;

  @ApiPropertyOptional({ description: 'Renda familiar' })
  @IsOptional()
  family_income: number;

  @ApiProperty({ description: 'Nível de escolaridade' })
  @IsEnum(EDUCATION_LEVEL)
  educationLevel: EDUCATION_LEVEL;

  @ApiProperty({ description: 'Instituição de ensino' })
  @IsString()
  institution: string;

  @ApiProperty({ description: 'Curso' })
  @IsString()
  course: string;

  @ApiProperty({ description: 'Status de emprego' })
  @IsString()
  job_status: string;

  @ApiProperty({ description: 'Onde estudou o ensino médio' })
  @IsString()
  where_study_secondary_school: string;

  @ApiProperty({
    type: () => CreatePhoneDto,
    description: 'Telefones de contato',
  })
  @IsObject()
  @ValidateNested()
  @Type(() => CreatePhoneDto)
  phones: CreatePhoneDto;

  @ApiProperty({ type: () => CreateAddressDto, description: 'Endereços' })
  @IsObject()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  addresses: CreateAddressDto;
}
