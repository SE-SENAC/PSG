import { TypeUser } from 'src/type-user/entities/type-user.entity';

export class ProfileDto {
  id: number;
  name: string;
  email: string;
  typeUser: TypeUser['role'];
}
