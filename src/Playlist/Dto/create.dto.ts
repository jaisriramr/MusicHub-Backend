import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, min } from 'class-validator';
import { Types } from 'mongoose';

export class CreatePlaylistDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'User Id is required' })
  user_id: Types.ObjectId;

  @ApiProperty()
  @IsNotEmpty({ message: 'Playlist description is required' })
  description: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Atlest one track id is required' })
  track_ids: Array<any>[];
}
