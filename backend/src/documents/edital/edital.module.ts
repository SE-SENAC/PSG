import { Module } from '@nestjs/common';
import { EditalService } from './edital.service';
import { EditalController } from './edital.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Edital } from './entities/edital.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Edital])],
  controllers: [EditalController],
  providers: [EditalService],
  exports: [EditalService],
})
export class EditalModule {}
