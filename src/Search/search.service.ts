import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Playlist, PlaylistDocument } from 'src/Playlist/playlist.schema';
import { Track, TrackDocument } from 'src/Track/track.schema';
import { User, UserDocument } from 'src/User/user.schema';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    @InjectModel(Playlist.name) private playlistModel: Model<PlaylistDocument>,
  ) {}
}
