import { IsString } from 'class-validator';

export default class LogoutDto {
  @IsString()
  token: string;
}
