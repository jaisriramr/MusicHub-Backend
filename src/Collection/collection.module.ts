import { Module } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Collection, CollectionSchema } from './collection.schema';
import { CollectionController } from './collection.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      {
        name: Collection.name,
        schema: CollectionSchema,
      },
    ]),
  ],
  controllers: [CollectionController],
  providers: [CollectionService],
})
export class CollectionModule {}
