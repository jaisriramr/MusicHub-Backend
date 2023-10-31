import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface CollectionType {
  name: string;
  playlist_ids: Array<any>[];
}

export type CollectionDocument = Collection & Document;

@Schema({ timestamps: true })
export class Collection {
  @Prop({ required: true })
  name: string;

  @Prop()
  collection: Array<CollectionType>[];
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);
