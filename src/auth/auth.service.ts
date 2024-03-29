import * as bcrypt from 'bcryptjs';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';
import { UserEntity } from 'src/user/entities/user.entity';
import { IUser } from './register.strategy';
import { UserService } from 'src/user/user.service';
import { ITokens, TokenService } from 'src/token/token.service';
import { UserDto } from './dto/user.dto';
import { TokenRepository } from 'src/token/token.repository';
import { DeleteResult } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly tokenRepository: TokenRepository,
  ) {}

  validateIsExisted(login: string): Promise<boolean> {
    return this.userRepository.isExist(login);
  }

  async validateUser(login: string, password: string): Promise<UserEntity> {
    const user = await this.userRepository.getByLogin(login);
    const isCompare = await bcrypt.compare(password, user.password);
    if (!isCompare) {
      throw new HttpException('User was not found', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async register(userFields: IUser): Promise<ITokens> {
    const user = await this.userService.create(userFields);
    return this.login(user);
  }

  async login(user: UserEntity): Promise<ITokens> {
    const userDto = new UserDto(user); // id, login
    const tokens = this.tokenService.generateTokens({ ...userDto });
    await this.tokenRepository.save(user, tokens.refreshToken);
    return tokens;
  }

  async logout(refreshToken: string): Promise<DeleteResult> {
    return this.tokenRepository.remove(refreshToken);
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    const userData = this.tokenService.validateRefreshToken(refreshToken);
    const token = await this.tokenRepository.findRefresh(refreshToken);
    if (!userData || !token) {
      throw new UnauthorizedException();
    }
    const user = await this.userRepository.getById(userData.id);
    return this.login(user);
  }
}
