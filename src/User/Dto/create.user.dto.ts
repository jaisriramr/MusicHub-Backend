import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, isNotEmpty, min } from 'class-validator';
import { Types } from 'mongoose';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'User name is required!' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Gender is required' })
  gender: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Date of birth is required' })
  dob: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Atleast pass default profile picture url' })
  profile_picture_url: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'User type is a must' })
  account_type: string;

  @ApiProperty()
  listeners_count: number;

  @ApiProperty()
  verified_account: boolean;
}
