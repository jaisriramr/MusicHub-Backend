import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './Dto/create.user.dto';
import * as bcrypt from 'bcrypt';
import { WelcomeMail } from 'src/Utils/mail';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './Dto/update.user.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async registerUser(@Body() CreateUserDto: CreateUserDto) {
    try {
      const doesUserExist = await this.userService.findUserViaEmail(
        CreateUserDto.email,
      );

      if (doesUserExist) {
        throw new HttpException('Email already in use', 409);
      } else {
        const salt = await bcrypt.genSaltSync();
        const hash = await bcrypt.hashSync(CreateUserDto.password, salt);

        CreateUserDto.password = undefined;
        CreateUserDto.profile_picture_url = process.env.DEFAULT_PROFILE_PIC_URL;
        CreateUserDto.account_type = 'user';

        Object.assign(CreateUserDto, { hashed_password: hash, salt });

        let userCreationResponse = await this.userService.create(CreateUserDto);

        if (userCreationResponse) {
          let sendMail = await WelcomeMail({
            to: CreateUserDto.email,
            name: CreateUserDto.name,
          });

          await this.cacheManager
            .set(CreateUserDto.email, CreateUserDto, { ttl: 0 })
            .then((response: any) => {
              console.log('reg ccc ', response);
            });

          return { message: 'Successfully created account' };
        }
      }
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }

  @Post('login')
  async loginUser(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    try {
      const cacheUser: any = await this.cacheManager.get(email);
      console.log('cc login ', cacheUser);
      if (cacheUser) {
        // check password with the cached one
        const compare = await bcrypt.compare(
          password,
          cacheUser.hashed_password,
        );

        if (compare) {
          cacheUser.salt = undefined;
          cacheUser.hashed_password = undefined;

          const token = await this.jwtService.sign(cacheUser, {
            secret: process.env.JWT_SECRET,
            expiresIn: '1d',
          });

          return { token };
        } else {
          throw new UnauthorizedException('Password Incorrect');
        }
      } else {
        let user: any = await this.userService.findUserViaEmail(email);

        if (user) {
          const compare = await bcrypt.compare(password, user.hashed_password);
          if (compare) {
            user.hashed_password = undefined;
            user.salt = undefined;

            const token = await this.jwtService.sign(
              { user },
              {
                secret: process.env.JWT_SECRET,
                expiresIn: '1d',
              },
            );

            return { token };
          } else {
            throw new UnauthorizedException('Password Incorrect');
          }
        } else {
          throw new NotFoundException('Email does not exist!');
        }
      }
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }

  @Get('profile')
  async getProfile(@Query('email') email: string) {
    try {
      const cacheUser: any = await this.cacheManager.get(email);
      console.log('ccc profile ', cacheUser);
      if (cacheUser) {
        cacheUser.hashed_password = undefined;
        cacheUser.salt = undefined;

        return { cacheUser };
      } else {
        const user = await this.userService.findUserViaEmail(email);

        if (user) {
          user.hashed_password = undefined;
          user.salt = undefined;

          return user;
        } else {
          throw new NotFoundException('Email ID does not exist');
        }
      }
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }

  @Put('update')
  async updateProfile(@Body() updateUserDto: UpdateUserDto) {
    try {
      const user: any = await this.userService.findUserViaEmail(
        updateUserDto.email,
      );

      if (user) {
        let userUpdateResponse = await this.userService.update(updateUserDto);
        Object.assign(updateUserDto, {
          hashed_password: user.hashed_password,
          salt: user.salt,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        });
        this.cacheManager.set(updateUserDto.email, updateUserDto, { ttl: 0 });

        return { userUpdateResponse };
      } else {
        throw new NotFoundException('Email Id does not exist');
      }
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }

  @Delete('remove:id')
  async removeUser(@Param('id') id: string) {
    try {
      const user = await this.userService.readSingle(id);

      if (user) {
        await this.cacheManager.del(user.email);

        const deletedUser = await this.userService.dsingle(id);

        if (deletedUser.acknowledged) {
          return { message: 'User successfully deleted' };
        } else {
          throw new HttpException('Internal Error', 500);
        }
      } else {
        throw new NotFoundException('No User Found');
      }
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }
}
