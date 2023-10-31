import { SearchService } from './search.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Playlist, PlaylistSchema } from 'src/Playlist/playlist.schema';
import { Track, TrackSchema } from 'src/Track/track.schema';
import { User, UserSchema } from 'src/User/user.schema';
import { SearchController } from './search.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Track.name,
        schema: TrackSchema,
      },
      {
        name: Playlist.name,
        schema: PlaylistSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
