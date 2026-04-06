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

  @Column()
  title: string;

  @Column()
  period_day: PERIOD_DAY;

  @Column()
  address: string;

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

  @OneToMany(() => Subscription, (subscription) => subscription.course, { cascade: true })
  subscriptions: Subscription[];

  @ManyToOne(() => Category, (category) => category.courses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'categoryId' })
  category: Category;
}
