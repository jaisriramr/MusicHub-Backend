import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Queue, QueueDocument } from './queue.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class QueueService {
  constructor(
    @InjectModel(Queue.name) private queueModel: Model<QueueDocument>,
  ) {}

  create = async (createQueue: any) => {
    const queueObj = new this.queueModel(createQueue);
    return await queueObj.save();
  };

  update = async (updateQueue: any) => {
    return await this.queueModel.updateOne(
      { _id: new Types.ObjectId(updateQueue._id) },
      { updateQueue },
    );
  };

  GetUserQueue = async (id: string) => {
    return await this.queueModel.findOne({ user_id: new Types.ObjectId(id) });
  };

  removeQueue = async (id: string) => {
    return await this.queueModel.deleteOne({ _id: new Types.ObjectId(id) });
  };
}
