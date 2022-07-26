import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

export interface IUser {
  login: string;
  password: string;
}

@Injectable()
export class RegisterStrategy extends PassportStrategy(Strategy, 'register') {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'login' });
  }

  async validate(login: string, password: string): Promise<IUser> {
    const isExist = this.authService.validateIsExisted(login);
    if (isExist) {
      throw new UnauthorizedException('Такой пользователь уже существует');
    }
    return { login, password };
  }
}
