import { Module } from '@nestjs/common';
import { TypeUserService } from './type-user.service';
import { TypeUserController } from './type-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeUser } from './entities/type-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TypeUser])],
  controllers: [TypeUserController],
  providers: [TypeUserService],
})
export class TypeUserModule {}
