import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiretrizesController } from './diretrizes.controller';
import { DiretrizesService } from './diretrizes.service';
import { Diretriz } from './entities/diretriz.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Diretriz])],
  controllers: [DiretrizesController],
  providers: [DiretrizesService],
  exports: [DiretrizesService],
})
export class DiretrizesModule {}
