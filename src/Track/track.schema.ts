import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TrackDocument = Track & Document;

@Schema({ timestamps: true })
export class Track {
  @Prop({ required: true })
  user_id: Types.ObjectId;

  @Prop({ required: true, min: 2 })
  name: string;

  @Prop({})
  lyric: string;

  @Prop({ required: true })
  track_url: string;

  @Prop({ required: true })
  track_time: string;

  @Prop({})
  listener_count: number;

  @Prop({ required: true })
  track_image_url: string;

  @Prop({ requied: true })
  track_type: string;

  @Prop({ required: true })
  Key: string;

  @Prop({ required: true })
  Bucket: string;
}

export const TrackSchema = SchemaFactory.createForClass(Track);
