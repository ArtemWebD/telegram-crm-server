import { Injectable } from '@nestjs/common';
import { TokenBody, TokenService } from 'src/token/token.service';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async validateForRegister(login: string): Promise<boolean> {
    return !!(await this.userService.findByLogin(login));
  }

  async validateForLogin(
    login: string,
    password: string,
  ): Promise<null | number> {
    const user = await this.userService.findByLogin(login);
    if (!user) {
      return null;
    }
    const isRightPass = await this.userService.checkPassword(
      password,
      user.password,
    );
    if (!isRightPass) {
      return null;
    }
    return user.id;
  }

  async createUser(authDto: AuthDto): Promise<void> {
    await this.userService.createUser(authDto.login, authDto.password);
  }

  async login(tokenBody: TokenBody): Promise<string> {
    console.log(tokenBody);
    return this.tokenService.createTokens(tokenBody.userId);
  }
}
