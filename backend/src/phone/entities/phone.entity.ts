import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Phone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  number: string;

  @Column()
  ddd: string;

  @Column()
  ddi: string;

  @ManyToOne(() => User, (user) => user.phones, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
