import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { JwtService } from '@nestjs/jwt';
import { CreateTrackDto } from './Dto/create.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { S3Service } from 'src/Utils/S3.service';
import { Cache } from 'cache-manager';
import { Types } from 'mongoose';
import { UpdateTrackDto } from './Dto/update.dto';

@Controller('track')
export class TrackController {
  constructor(
    private readonly trackService: TrackService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly jwtService: JwtService,
    private readonly s3Service: S3Service,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'file', maxCount: 1 },
      { name: 'trackPhoto', maxCount: 1 },
    ]),
  )
  async uploadTrack(
    @Body() createTrackDto: CreateTrackDto,
    @UploadedFiles() file: any,
  ) {
    try {
      console.log(file);
      const s3Response = await this.s3Service.UploadFile(file.file[0]);
      const s3TrackPhoto = await this.s3Service.UploadFile(file.trackPhoto[0]);

      const query = {
        user_id: new Types.ObjectId(createTrackDto.user_id),
        name: createTrackDto.name,
        lyric: createTrackDto.lyric,
        track_url: s3Response.Location,
        Key: s3Response.Key,
        Bucket: s3Response.Bucket,
        track_time: createTrackDto.track_time,
        listener_count: 0,
        track_image_url: s3TrackPhoto.Location,
        track_type: createTrackDto.track_type,
      };

      const response = await this.trackService.create(query);
      await this.cacheManager.set(response._id.toString(), response);
      return { message: 'Track successfully uploaded!', data: response };
    } catch (err) {
      console.log('eee ', err);
      throw new HttpException(err, 500);
    }
  }

  @Get('read/:id')
  async readTrack(@Param('id') id: string) {
    try {
      const cachedTrack = await this.cacheManager.get(id);

      if (cachedTrack) {
        return { message: 'Track fetched successfully', data: cachedTrack };
      } else {
        const track = await this.trackService.getTrackById(id);
        if (track) {
          await this.cacheManager.set(id, track);
          return { message: 'Track fetched successfully', data: track };
        } else {
          throw new NotFoundException('No such track found');
        }
      }
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }

  @Put('update')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'file', maxCount: 1 },
      { name: 'trackPhoto', maxCount: 1 },
    ]),
  )
  async updateTrack(
    @Body() updateTrackDto: UpdateTrackDto,
    @UploadedFiles() file: any,
  ) {
    try {
      if (file.file[0]) {
        await this.s3Service.removeFile(updateTrackDto.track_url);
        const s3Response = await this.s3Service.UploadFile(file.file[0]);
        updateTrackDto.track_url = s3Response.Location;
        Object.assign(updateTrackDto, {
          Key: s3Response.Key,
          Bucket: s3Response.Bucket,
        });
      }
      if (file.trackPhoto[0]) {
        await this.s3Service.removeFile(updateTrackDto.track_image_url);
        const s3Response = await this.s3Service.UploadFile(file.trackPhoto[9]);
        updateTrackDto.track_image_url = s3Response.Location;
      }

      const trackUpdated = await this.trackService.updateOne(updateTrackDto);

      if (trackUpdated.acknowledged) {
        const track = await this.trackService.getTrackById(
          updateTrackDto._id.toString(),
        );
        this.cacheManager.set(updateTrackDto._id.toString(), track);
        return { message: 'Track updated successfully', data: track };
      } else {
        throw new HttpException('Internal Server Error', 500);
      }
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }

  @Delete('remove/:id')
  async removeTrack(@Param('id') id: string) {
    try {
      return await this.trackService.removeTrack(id);
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }
}
