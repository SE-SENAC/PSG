import { User } from 'src/user/entities/user.entity';
import { IsString, IsNumber } from 'class-validator';

export class CreateLogActivityDto {
  @IsString()
  ip: string;

  @IsString()
  page_route: string;

  @IsString()
  action: string;

  @IsNumber()
  status: number;

  @IsString()
  method: string;
}
