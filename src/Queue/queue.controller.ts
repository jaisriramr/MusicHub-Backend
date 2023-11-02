import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { QueueService } from './queue.service';
import { Types } from 'mongoose';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Controller('queue')
export class QueueController {
  constructor(
    private readonly queueService: QueueService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

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

      const response = await this.queueService.create(query);
      this.cacheManager.set(response._id, response);
      return response;
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

      const response = await this.queueService.update(query);

      this.cacheManager.set(_id, query);
      return response;
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }

  @Get('read/:id')
  async read(@Param('id') id: string) {
    try {
      const cachedData = this.cacheManager.get(id);

      if (cachedData) {
        return cachedData;
      } else {
        const response = await this.queueService.GetUserQueue(id);
        this.cacheManager.set(response._id, response);
        return response;
      }
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }

  @Delete('remove/:id')
  async remove(@Param('id') id: string) {
    try {
      this.cacheManager.del(id);
      return await this.queueService.removeQueue(id);
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }
}
