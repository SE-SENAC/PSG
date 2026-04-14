import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
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
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('search') search?: string,
    @Query('method') method?: string,
    @Query('period') period?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.logActivityService.findAll(
      { page, limit, route: '/log-activity' }, 
      { search, method, period, startDate, endDate }
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logActivityService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLogActivityDto: UpdateLogActivityDto,
  ) {
    return this.logActivityService.update(id, updateLogActivityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.logActivityService.remove(id);
  }
}
