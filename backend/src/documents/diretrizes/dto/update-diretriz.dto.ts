import { PartialType } from '@nestjs/swagger';
import { CreateDiretrizDto } from './create-diretriz.dto';

export class UpdateDiretrizDto extends PartialType(CreateDiretrizDto) {}
