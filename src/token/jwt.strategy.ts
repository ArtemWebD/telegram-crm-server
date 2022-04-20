import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { TokenBody, TokenService } from './token.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        if (!req || !req.cookies || !req.cookies.token) {
          return null;
        }
        return req.cookies.token;
      },
      ignoreExpiration: true,
      secretOrKey: configService.get('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: TokenBody): Promise<TokenBody> {
    req.cookies.token = await this.tokenService.checkToken(req.cookies.token);
    return payload;
  }
}
