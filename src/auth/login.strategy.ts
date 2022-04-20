import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { TokenBody } from 'src/token/token.service';
import { AuthService } from './auth.service';

@Injectable()
export class LoginStrategy extends PassportStrategy(Strategy, 'login') {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'login' });
  }

  async validate(login: string, password: string): Promise<TokenBody> {
    const id = await this.authService.validateForLogin(login, password);
    if (!id) {
      throw new UnauthorizedException('Неверно введен логин или пароль');
    }
    return { userId: id };
  }
}
