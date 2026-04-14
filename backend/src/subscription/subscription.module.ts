import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { User } from 'src/user/entities/user.entity';
import { Student } from 'src/student/entities/student.entity';
import { TypeUser } from 'src/type-user/entities/type-user.entity';
import { Course } from 'src/course/entities/course.entity';
import { Configuration } from 'src/configuration/entities/configuration.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription, User, Student, TypeUser, Course, Configuration])],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
