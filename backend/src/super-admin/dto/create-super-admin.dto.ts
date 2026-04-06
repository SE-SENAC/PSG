import { IsNumber } from 'class-validator';

export class CreateSuperAdminDto {
  @IsNumber()
  SuperAdminId: number;

  @IsNumber()
  userId: number;
}
