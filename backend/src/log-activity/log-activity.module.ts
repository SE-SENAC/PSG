import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { LogActivityService } from './log-activity.service';
import { LogActivityController } from './log-activity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogActivity } from './entities/log-activity.entity';
import { LogActivityMiddleware } from './log-activity.middleware';

@Module({
  controllers: [LogActivityController],
  providers: [LogActivityService],
  imports: [TypeOrmModule.forFeature([LogActivity])],
  exports: [LogActivityService],
})
export class LogActivityModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LogActivityMiddleware)
      .exclude(
        { path: 'log-activity', method: RequestMethod.ALL },
        { path: 'auth/(.*)', method: RequestMethod.ALL },
      )
      .forRoutes('*');
  }
}
