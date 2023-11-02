import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { QueueService } from './queue.service';
import { Types } from 'mongoose';

@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post('create')
  async create(
    @Body('user_id') user_id: string,
    @Body('track_queue') track_queue: string,
  ) {
    try {
      const query = {
        user_id: new Types.ObjectId(user_id),
        track_queue,
      };

      return await this.queueService.create(query);
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }

  @Put('update')
  async update(
    @Body('_id') _id: string,
    @Body('user_id') user_id: string,
    @Body('track_queue') track_queue: string,
  ) {
    try {
      const query = {
        _id,
        user_id: new Types.ObjectId(user_id),
        track_queue,
      };

      return await this.queueService.update(query);
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }

  @Get('read/:id')
  async read(@Param('id') id: string) {
    try {
      return await this.queueService.GetUserQueue(id);
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }

  @Delete('remove/:id')
  async remove(@Param('id') id: string) {
    try {
      return await this.queueService.removeQueue(id);
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }
}
