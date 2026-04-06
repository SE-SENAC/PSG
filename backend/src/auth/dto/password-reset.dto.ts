import { IsEmail } from 'class-validator';

export default class PasswordResetDto {
  @IsEmail()
  email: string;
}
