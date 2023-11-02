import { UpdateTrackDto } from './Dto/update.dto';
import { CreateTrackDto } from './Dto/create.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Track, TrackDocument } from './track.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class TrackService {
  constructor(
    @InjectModel(Track.name) private TrackModel: Model<TrackDocument>,
  ) {}

  async create(CreateTrackDto: CreateTrackDto) {
    const createTrack = new this.TrackModel(CreateTrackDto);
    return await createTrack.save();
  }

  async getTrackById(id: string) {
    const pipeline = [
      {
        $match: {
          _id: new Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'artist',
        },
      },
      {
        $project: {
          _id: 0,
          user_id: 1,
          name: 1,
          lyric: 1,
          track_url: 1,
          track_time: 1,
          listener_count: 1,
          track_image_url: 1,
          track_type: 1,
          createdAt: 1,
          updatedAt: 1,
          'artist.name': 1,
          'artist.profile_picture_url': 1,
        },
      },
    ];
    // return await this.TrackModel.findOne({ _id: new Types.ObjectId(id) });
    return await this.TrackModel.aggregate(pipeline);
  }

  async updateOne(UpdateTrackDto: UpdateTrackDto) {
    return await this.TrackModel.updateOne(
      { _id: new Types.ObjectId(UpdateTrackDto._id) },
      { UpdateTrackDto },
    );
  }

  async removeTrack(id: string) {
    return await this.TrackModel.deleteOne({ _id: new Types.ObjectId(id) });
  }
}
