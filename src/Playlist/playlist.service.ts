import { updatePlaylistDto } from './Dto/update.dto';
import { UpdateTrackDto } from './../Track/Dto/update.dto';
import { CreatePlaylistDto } from './Dto/create.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Playlist, PlaylistDocument } from './playlist.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectModel(Playlist.name) private playlistModel: Model<PlaylistDocument>,
  ) {}

  async create(createPlaylistDto: CreatePlaylistDto) {
    const createdPlaylist = new this.playlistModel(createPlaylistDto);
    return await createdPlaylist.save();
  }

  async readByID(id: string) {
    return await this.playlistModel.findById(id);
  }

  async updatePlaylist(updatePlaylistDto: updatePlaylistDto) {
    return await this.playlistModel.updateOne(
      { _id: new Types.ObjectId(updatePlaylistDto._id) },
      { updatePlaylistDto },
    );
  }

  async removePlaylist(id: string) {
    return await this.playlistModel.deleteOne({ _id: new Types.ObjectId(id) });
  }

  async listUserPlaylist(id: string) {
    return await this.playlistModel.find({ user_id: new Types.ObjectId(id) });
  }
}
