import { IsNumber, IsString, Matches } from 'class-validator';
import { IsCPF } from 'class-validator-cpf';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateStudentDto {
  @ApiProperty({ example: '123.456.789-00', description: 'CPF do estudante' })
  @IsCPF()
  @Matches(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, {
    message: 'CPF deve estar no formato 000.000.000-00',
  })
  cpf: string;

  @ApiProperty({ example: 1200.0, description: 'Renda pessoal' })
  @IsNumber()
  personalIncome: number;

  @ApiProperty({ example: 3500.0, description: 'Renda familiar' })
  @IsNumber()
  familyIncome: number;

  @ApiProperty({ example: 4, description: 'Número de dependentes em casa' })
  @IsNumber()
  number_parents_in_home: number;

  @ApiProperty({ example: 'Maria Silva', description: 'Nome da mãe' })
  @IsString()
  mother_name: string;

  @ApiProperty({ example: 'José Silva', description: 'Nome do pai' })
  @IsString()
  father_name: string;

  @ApiProperty({
    example: 'Ensino Médio Completo',
    description: 'Nível de escolaridade',
  })
  @IsString()
  education: string;

  @ApiProperty({
    example: 'Escola Estadual Tancredo Neves',
    description: 'Nome da instituição de ensino',
  })
  @IsString()
  institutionName: string;

  @ApiProperty({ example: 1, description: 'ID do usuário associado' })
  @IsNumber()
  userId: number;
}
