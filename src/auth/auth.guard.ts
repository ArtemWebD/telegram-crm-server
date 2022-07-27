import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const { accessToken } = req.cookies;
    if (!accessToken) {
      throw new UnauthorizedException();
    }
    const userData = this.tokenService.validateAccessToken(accessToken);
    if (!userData) {
      throw new UnauthorizedException();
    }
    req.user = userData;
    return true;
  }
}
