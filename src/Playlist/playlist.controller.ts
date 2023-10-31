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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';
import { S3Service } from 'src/Utils/S3.service';
import { CreatePlaylistDto } from './Dto/create.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { updatePlaylistDto } from './Dto/update.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('playlist')
export class PlaylistController {
  constructor(
    private readonly playlistService: PlaylistService,
    // @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly jwtService: JwtService,
    private readonly s3Service: S3Service,
  ) {}

  @Post('create')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async createPlaylist(
    @Body() createPlaylistDto: CreatePlaylistDto,
    @UploadedFile() file: any,
  ) {
    try {
      const s3Response = await this.s3Service.UploadFile(file);

      Object.assign(createPlaylistDto, {
        playlist_image_url: s3Response.Location,
      });

      const response = await this.playlistService.create(createPlaylistDto);
      // this.cacheManager.set(response._id.toString(), response, { ttl: 0 });

      return response;
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }

  @Get('read/:id')
  async readSinglePlaylist(@Param('id') id: string) {
    try {
      // const cachedData = await this.cacheManager.get(id);
      // if (cachedData) {
      //   return cachedData;
      // } else {

      const response = await this.playlistService.readByID(id);
      if (response) {
        // this.cacheManager.set(id, response, { ttl: 0 }); // ttl in seconds
        return response;
      } else {
        throw new NotFoundException('Playlist is not found');
      }
      // }
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }

  @Get('list/user/:id')
  async listUserPlaylist(@Param('id') id: string) {
    try {
      return await this.playlistService.listUserPlaylist(id);
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }

  @Put('update')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updatePlaylist(
    @Body() updatePlaylistDto: updatePlaylistDto,
    @UploadedFile() file: any,
  ) {
    try {
      if (file) {
        const s3Response = await this.s3Service.UploadFile(file);
        updatePlaylistDto.playlist_image_url = s3Response.Location;
      }

      const response = await this.playlistService.updatePlaylist(
        updatePlaylistDto,
      );

      if (response.acknowledged) {
        const playlist = await this.playlistService.readByID(
          updatePlaylistDto._id.toString(),
        );
        // this.cacheManager.set(updatePlaylistDto._id.toString(), playlist, {
        //   ttl: 0,
        // });
      }

      return { message: 'Playlist updated successfully', data: response };
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }

  @Delete('remove/:id')
  @UseGuards(AuthGuard)
  async removePlaylist(@Param('id') id: string) {
    try {
      // const cachedData = await this.cacheManager.get(id);

      // this.cacheManager.del(id);
      // if (cachedData) {
      //   const deleteResult = await this.playlistService.removePlaylist(id);
      //   return {
      //     message: 'Removed the playlist successfully',
      //     data: deleteResult,
      //   };
      // } else {

      const playlist = await this.playlistService.readByID(id);

      if (playlist) {
        const deleteResult = await this.playlistService.removePlaylist(id);
        return {
          message: 'Removed the playlist successfully',
          data: deleteResult,
        };
      }
      // }
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }
}
