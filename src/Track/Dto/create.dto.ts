import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateTrackDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'User Id must not be empty' })
  user_id: Types.ObjectId;

  @ApiProperty()
  @IsNotEmpty({ message: 'Must name the track' })
  name: string;

  @ApiProperty()
  lyric: string;

  @ApiProperty()
  track_url: string;

  @ApiProperty()
  track_time: string;

  @ApiProperty()
  listener_count: number;

  @ApiProperty()
  track_image_url: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Track type must be passes' })
  track_type: string;
}
