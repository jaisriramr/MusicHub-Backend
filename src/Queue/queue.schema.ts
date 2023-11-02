import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type QueueDocument = Queue & Document;

@Schema({ timestamps: true })
export class Queue {
  @Prop({ required: true })
  user_id: Types.ObjectId;

  @Prop({ required: true })
  track_queue: Array<any>[];
}

export const QueueSchema = SchemaFactory.createForClass(Queue);
