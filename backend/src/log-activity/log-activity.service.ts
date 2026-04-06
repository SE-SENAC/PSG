import { Injectable } from '@nestjs/common';
import { CreateLogActivityDto } from './dto/create-log-activity.dto';
import { UpdateLogActivityDto } from './dto/update-log-activity.dto';

@Injectable()
export class LogActivityService {
  create(createLogActivityDto: CreateLogActivityDto) {
    return 'This action adds a new logActivity';
  }

  findAll() {
    return `This action returns all logActivity`;
  }

  findOne(id: number) {
    return `This action returns a #${id} logActivity`;
  }

  update(id: number, updateLogActivityDto: UpdateLogActivityDto) {
    return `This action updates a #${id} logActivity`;
  }

  remove(id: number) {
    return `This action removes a #${id} logActivity`;
  }
}
