import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const token = req.cookies.token;
    if (!token) {
      throw new UnauthorizedException('Истек срок действия сессии');
    }
    req.body.userId = user.userId;
    res.status(200).cookie('token', token, {
      httpOnly: true,
      domain: this.configService.get<string>('COOKIE_DOMAIN'),
      expires: new Date(Date.now() + 1000 * 60 * 60 * 36),
      secure: this.configService.get<boolean>('COOKIE_SECURE'),
    });
    return token;
  }
}
