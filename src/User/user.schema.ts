import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, min: 2 })
  name: string;
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  dob: string;

  @Prop({ required: true })
  profile_picture_url: string;

  @Prop({ required: true })
  account_type: string; // user, artist

  @Prop({})
  listeners_count: number;

  @Prop({})
  verified_account: boolean;

  @Prop({ required: true })
  hashed_password: string;

  @Prop({ required: true })
  salt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
