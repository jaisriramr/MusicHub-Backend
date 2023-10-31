import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    if (!token) {
      return false;
    }

    try {
      const nToken = token.split(' ')[1];
      const decoded = this.jwtService.verify(nToken, {
        secret: process.env.JWT_SECRET,
      });
      request.user = decoded;
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
