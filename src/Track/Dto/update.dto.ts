import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateTrackDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Track _id must be passes' })
  _id: Types.ObjectId;

  @ApiProperty()
  @IsNotEmpty({ message: 'User Id must not be empty' })
  user_id: Types.ObjectId;

  @ApiProperty()
  @IsNotEmpty({ message: 'Must name the track' })
  name: string;

  @ApiProperty()
  lyric: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Track url must be empty' })
  track_url: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Track time must be added' })
  track_time: string;

  @ApiProperty()
  listener_count: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Track image url must be added' })
  track_image_url: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Track type must be passes' })
  track_type: string;
}
