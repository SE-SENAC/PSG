import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IS_PCD } from 'src/commons/pcd';
import { PCD_TYPE } from 'src/commons/pcd';
import { Gender } from 'src/commons/gender';
import { EDUCATION_LEVEL } from '../enum/education_level';

@Entity()
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cpf: string;

  @Column()
  gender: Gender;

  @Column()
  birth_date: Date;

  @Column()
  is_pcd: IS_PCD;

  @Column()
  pcd_type: PCD_TYPE;

  @Column()
  personal_income: number;

  @Column()
  family_income: number;

  @Column()
  number_parents_in_home: number;

  @Column()
  mother_name: string;

  @Column()
  father_name: string;

  @Column()
  educationLevel: EDUCATION_LEVEL;

  @Column()
  institution: string;

  @Column()
  course: string;

  @Column()
  job_status: string;

  @Column()
  where_study_secondary_school: string;

  @OneToOne(() => User, (user) => user.student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
