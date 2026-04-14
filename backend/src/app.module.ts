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
import { DiretrizesModule } from './documents/diretrizes/diretrizes.module';
import { SuperAdminSeed } from '../seed';
import { LogActivityMiddleware } from './log-activity/log-activity.middleware';
import { ConfigurationModule } from './configuration/configuration.module';

@Module({
  imports: [
    // Configuração do Cache utilizando Redis
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: redisStore,
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        ttl: 600, // 10 minutos de cache por padrão para economizar processamento do BD
        max: 1000, // Máximo de itens em cache
      }),
    }),
    // Configuração das variáveis de ambiente
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Configuração do serviço de email
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
    // Configuração do Banco de Dados (SQL Server / MSSQL)
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST ?? '127.0.0.1',
      port: parseInt(process.env.DB_PORT || '1433'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/**/*.migration{.ts,.js}'],
      subscribers: [__dirname + '/**/*.subscriber{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true, // Nota: Use apenas em desenvolvimento
      connectionTimeout: 30000,
      requestTimeout: 30000,
      extra: {
        options: {
          trustServerCertificate: true,
          encrypt: false,
          enableArithAbort: true,
          cancelTimeout: 10000,
        },
      },
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
      },
    }),
    // Importação dos módulos da aplicação
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
    DiretrizesModule,
    ConfigurationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Seeders para carregamento inicial de dados
    CourseSeed,
    EditalSeed,
    ResultSeed,
    CategorySeed,
    AdminSeed,
    SuperAdminSeed,
    SigApiConsumerService,
  ],
})
export class AppModule {}
