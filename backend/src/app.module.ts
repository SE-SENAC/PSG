import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { StudentModule } from './student/student.module';
import { CourseModule } from './course/course.module';
import { CategoryModule } from './category/category.module';
import { TypeUserModule } from './type-user/type-user.module';
import { AdminModule } from './admin/admin.module';
import { SuperAdminModule } from './super-admin/super-admin.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { AddressModule } from './address/address.module';
import { PhoneModule } from './phone/phone.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CourseSeed } from '../seed';
import { EditalModule } from './documents/edital/edital.module';
import { EditalSeed } from '../seed';
import { ResultModule } from './documents/result/result.module';
import { ResultSeed } from '../seed';
import { CategorySeed } from '../seed';
import { MailerModule } from '@nestjs-modules/mailer';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { HttpModule } from '@nestjs/axios';
import { SigApiConsumerModule } from './sig-api-consumer/sig-api-consumer.module';
import { SigApiConsumerService } from './sig-api-consumer/sig-api-consumer.service';
import { AdminSeed } from '../seed';
import { LogActivityModule } from './log-activity/log-activity.module';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore,
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'localhost',
      port: 1433,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/**/*.migration{.ts,.js}'],
      subscribers: [__dirname + '/**/*.subscriber{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
      extra: {
        options: {
          trustServerCertificate: true,
          encrypt: true,
        },
      },
    }),
    HttpModule,
    EditalModule,
    ResultModule,
    UserModule,
    StudentModule,
    CourseModule,
    CategoryModule,
    TypeUserModule,
    AdminModule,
    SuperAdminModule,
    SubscriptionModule,
    AddressModule,
    PhoneModule,
    AuthModule,
    SigApiConsumerModule,
    LogActivityModule,
  ],
  controllers: [AppController],
  providers: [AppService, CourseSeed, EditalSeed, ResultSeed, CategorySeed, AdminSeed, SigApiConsumerService],
})
export class AppModule {}
