import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './Dto/create.user.dto';
import { UpdateUserDto } from './Dto/update.user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

  async create(userCreateDto: CreateUserDto) {
    const createModel = new this.UserModel(userCreateDto);
    return await createModel.save();
  }

  async readSingle(id: string) {
    return await this.UserModel.findById(id);
  }

  async findUserViaEmail(email: string) {
    return await this.UserModel.findOne({ email });
  }

  async dsingle(id: string) {
    return await this.UserModel.deleteOne({ _id: new Types.ObjectId(id) });
  }

  async update(userUpdateDto: UpdateUserDto) {
    return await this.UserModel.updateOne({
      _id: new Types.ObjectId(userUpdateDto._id),
      userUpdateDto,
    });
  }
}
