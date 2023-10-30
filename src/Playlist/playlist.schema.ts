import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PlaylistDocument = Playlist & Document;

@Schema({ timestamps: true })
export class Playlist {
  @Prop({ required: true })
  user_id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({})
  description: string;

  @Prop({ required: true })
  playlist_image_url: string;

  @Prop({ required: true })
  track_ids: Array<any>[];

  @Prop({ required: true })
  type: string; // album or likes songs or playlist
}

export const PlaylistSchema = SchemaFactory.createForClass(Playlist);
