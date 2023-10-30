import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Track, TrackSchema } from './track.schema';
import { JwtModule } from '@nestjs/jwt';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { S3Service } from 'src/Utils/S3.service';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      {
        name: Track.name,
        schema: TrackSchema,
      },
    ]),
  ],
  providers: [TrackService, S3Service],
  controllers: [TrackController],
})
export class TrackModule {}
