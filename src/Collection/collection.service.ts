import { UpdateCollectionDto } from './Dto/update.dto';
import { CreateCollectionDto } from './Dto/create.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Collection, CollectionDocument } from './collection.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class CollectionService {
  constructor(
    @InjectModel(Collection.name)
    private collectionModel: Model<CollectionDocument>,
  ) {}

  async create(createCollectionDto: CreateCollectionDto) {
    const createdCollection = new this.collectionModel(createCollectionDto);
    return await createdCollection.save();
  }

  async findById(id: string) {
    return await this.collectionModel.findOne({ _id: new Types.ObjectId(id) });
  }

  async listAll(limit: number) {
    return await this.collectionModel.find({}).limit(limit);
  }

  async removeCollection(id: string) {
    return await this.collectionModel.deleteOne({
      _id: new Types.ObjectId(id),
    });
  }

  async updateCollection(updateCollectionDto: UpdateCollectionDto) {
    return await this.collectionModel.updateOne(
      { _id: new Types.ObjectId(updateCollectionDto._id) },
      { updateCollectionDto },
    );
  }
}
