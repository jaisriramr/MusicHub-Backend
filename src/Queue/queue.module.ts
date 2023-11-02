import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Queue, QueueSchema } from './queue.schema';
import { QueueService } from './queue.service';
import { Track, TrackSchema } from 'src/Track/track.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Queue.name,
        schema: QueueSchema,
      },
      {
        name: Track.name,
        schema: TrackSchema,
      },
    ]),
  ],
  providers: [QueueService],
  controllers: [],
})
export class QueueModule {}
