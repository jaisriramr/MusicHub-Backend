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
    return await this.TrackModel.findOne({ _id: new Types.ObjectId(id) });
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
