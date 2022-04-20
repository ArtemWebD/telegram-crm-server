import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class RegisterStrategy extends PassportStrategy(Strategy, 'register') {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'login' });
  }

  async validate(login: string, password: string): Promise<AuthDto> {
    const isExist = await this.authService.validateForRegister(login);
    console.log(isExist);
    if (isExist) {
      throw new UnauthorizedException(
        'Пользователь с таким логином уже существует',
      );
    }
    return { login, password };
  }
}
