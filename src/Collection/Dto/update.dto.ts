import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateCollectionDto {
  @ApiProperty()
  @IsNotEmpty({ message: '_id is required' })
  _id: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty()
  collection: Array<any>[];
}
