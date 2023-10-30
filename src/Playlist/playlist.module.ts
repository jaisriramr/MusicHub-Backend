import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Playlist, PlaylistSchema } from './playlist.schema';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';
import { S3Service } from 'src/Utils/S3.service';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      {
        name: Playlist.name,
        schema: PlaylistSchema,
      },
    ]),
  ],
  controllers: [PlaylistController],
  providers: [PlaylistService, S3Service],
})
export class PlayListModule {}
