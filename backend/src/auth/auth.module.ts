import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { TypeUser } from 'src/type-user/entities/type-user.entity';
import { Student } from 'src/student/entities/student.entity';
import { Admin } from 'src/admin/entities/admin.entity';
import { SuperAdmin } from 'src/super-admin/entities/super-admin.entity';
import { Address } from 'src/address/entities/address.entity';
import { Phone } from 'src/phone/entities/phone.entity';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { AuthJwtService } from './jwtService';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'PSG@0000',
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([
      User,
      Address,
      Phone,
      Student,
      SuperAdmin,
      Admin,
      SuperAdmin,
      TypeUser,
    ]),
    MailerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthJwtService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
