import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LogActivityService } from './log-activity.service';
import { CreateLogActivityDto } from './dto/create-log-activity.dto';
import { UpdateLogActivityDto } from './dto/update-log-activity.dto';

@Controller('log-activity')
export class LogActivityController {
  constructor(private readonly logActivityService: LogActivityService) {}

  @Post()
  create(@Body() createLogActivityDto: CreateLogActivityDto) {
    return this.logActivityService.create(createLogActivityDto);
  }

  @Get()
  findAll() {
    return this.logActivityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logActivityService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLogActivityDto: UpdateLogActivityDto) {
    return this.logActivityService.update(+id, updateLogActivityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.logActivityService.remove(+id);
  }
}
