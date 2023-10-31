import { CreateCollectionDto } from './Dto/create.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CollectionService } from './collection.service';
import { Types } from 'mongoose';
import { UpdateCollectionDto } from './Dto/update.dto';
import { AuthGuard } from 'src/auth/auth.guard';

export interface playlist_id {
  id: Types.ObjectId;
}

export interface CollectionType {
  name: string;
  playlist_ids: Array<playlist_id>[];
}

@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  async createCollection(@Body() createCollectionDto: CreateCollectionDto) {
    try {
      await createCollectionDto.collection.forEach(async (col: any, i: any) => {
        await col.playlist_ids.forEach((id: any, j: any) => {
          const newID = new Types.ObjectId(id);
          col.playlist_ids[j] = newID;
        });
      });

      return await this.collectionService.create(createCollectionDto);
    } catch (err) {
      console.log('EEERRR ', err);
      throw new HttpException(err, 500);
    }
  }

  @Get('read/:id')
  async GetSingleCollection(@Param('id') id: string) {
    try {
      return await this.collectionService.findById(id);
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }

  @Get('list')
  async ListCollection(@Query('limit') limit: number) {
    try {
      return await this.collectionService.listAll(limit ? limit : 10);
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }

  @Put('update')
  @UseGuards(AuthGuard)
  async updateCollection(@Body() updateCollectionDto: UpdateCollectionDto) {
    try {
      return await this.collectionService.updateCollection(updateCollectionDto);
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }

  @Delete('remove/:id')
  @UseGuards(AuthGuard)
  async removeCollection(@Param('id') id: string) {
    try {
      return await this.collectionService.removeCollection(id);
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }
}
