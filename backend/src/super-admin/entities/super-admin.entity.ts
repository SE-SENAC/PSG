import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class SuperAdmin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.superAdmin, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
