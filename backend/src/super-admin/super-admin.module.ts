import { Module } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { SuperAdminController } from './super-admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { TypeUser } from 'src/type-user/entities/type-user.entity';
import { SuperAdmin } from './entities/super-admin.entity';
import { Student } from 'src/student/entities/student.entity';
import { Course } from 'src/course/entities/course.entity';
import { Subscription } from 'src/subscription/entities/subscription.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SuperAdmin,
      User,
      TypeUser,
      Student,
      Course,
      Subscription,
    ]),
  ],
  controllers: [SuperAdminController],
  providers: [SuperAdminService],
  exports: [SuperAdminService],
})
export class SuperAdminModule {}
