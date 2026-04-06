import { Module } from '@nestjs/common';
import { LogActivityService } from './log-activity.service';
import { LogActivityController } from './log-activity.controller';

@Module({
  controllers: [LogActivityController],
  providers: [LogActivityService],
})
export class LogActivityModule {}
