import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IS_PCD } from 'src/common/enums/pcd';
import { PCD_TYPE } from 'src/common/enums/pcd';
import { Gender } from 'src/common/enums/gender';
import { EDUCATION_LEVEL } from '../enum/education_level';

@Entity()
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cpf: string;

  @Column({ nullable: true })
  gender: Gender;

  @Column()
  birth_date: Date;

  @Column({ nullable: true })
  is_pcd: IS_PCD;

  @Column({ nullable: true })
  pcd_type: PCD_TYPE;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  personal_income: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  family_income: number;

  @Column()
  number_parents_in_home: number;

  @Column({ nullable: true })
  mother_name: string;

  @Column({ nullable: true })
  father_name: string;

  @Column({ nullable: true })
  educationLevel: EDUCATION_LEVEL;

  @Column({ nullable: true })
  institution: string;

  @Column({ nullable: true })
  course: string;

  @Column({ nullable: true })
  job_status: string;

  @Column({ nullable: true })
  where_study_secondary_school: string;

  @OneToOne(() => User, (user) => user.student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
