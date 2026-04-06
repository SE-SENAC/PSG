import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ROLE } from '../enum/enum';
import { User } from 'src/user/entities/user.entity';
import { OneToMany } from 'typeorm';
import { JoinColumn } from 'typeorm';

@Entity()
export class TypeUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  role: ROLE;

  @OneToMany(() => User, (users) => users.typeUser, { cascade: true })
  users: User[];
}
