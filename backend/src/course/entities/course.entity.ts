import { Subscription } from 'src/subscription/entities/subscription.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { statusEnum } from '../enum/course-enum';
import { PERIOD_DAY } from '../enum/period_day';
import { COURSE_TYPE } from '../enum/course-type';
import { Category } from 'src/category/entities/category.entity';
import { JoinColumn } from 'typeorm';

@Entity()
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  img_url: string;

  @Column()
  status_vacancy: statusEnum;

  @Column({ type: 'nvarchar', length: 20, default: COURSE_TYPE.LIVRE })
  type: COURSE_TYPE;

  @Column()
  title: string;

  @Column({ type: 'nvarchar', length: 20 })
  period_day: PERIOD_DAY;

  @Column()
  address: string;

  @Column({ nullable: true })
  municipality: string;

  @Column()
  targetAudience: string;

  @Column()
  minAge: number;

  @Column()
  schooldays: string;

  @Column()
  workload: number;

  @Column()
  minimumEducation: string;

  @Column()
  description: string;

  @Column()
  code: string;

  @Column()
  availablePosition: number;

  @Column()
  classPeriodStart: Date;

  @Column()
  classPeriodEnd: Date;

  @Column()
  subscriptionStartDate: Date;

  @Column()
  subscriptionEndDate: Date;

  @Column()
  courseStart: Date;

  @Column()
  courseEnd: Date;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @OneToMany(() => Subscription, (subscription) => subscription.course, {
    cascade: true,
  })
  subscriptions: Subscription[];

  @Column({ name: 'categoryId', nullable: true })
  categoryId: string;

  @ManyToOne(() => Category, (category) => category.courses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;
}
