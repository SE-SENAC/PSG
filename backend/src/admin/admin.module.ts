import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { User } from 'src/user/entities/user.entity';
import { TypeUser } from 'src/type-user/entities/type-user.entity';
import { Address } from 'src/address/entities/address.entity';
import { Phone } from 'src/phone/entities/phone.entity';
import { Student } from 'src/student/entities/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, User, Student, TypeUser,Address,Phone])],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
