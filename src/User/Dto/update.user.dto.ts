import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, isNotEmpty, min } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: '_id is a must for a schema' })
  _id: Types.ObjectId;

  @ApiProperty()
  @IsNotEmpty({ message: 'User name is required!' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Gender is required' })
  gender: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Date of birth is required' })
  dob: string;

  @ApiProperty()
  profile_picture_url: string;

  @ApiProperty()
  account_type: string;

  @ApiProperty()
  listeners_count: number;

  @ApiProperty()
  verified_account: boolean;
}
