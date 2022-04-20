import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenEntity } from './entities/token.entity';

export interface TokenBody {
  userId: number;
  exp?: number;
}

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * @returns access jwt token
   */
  async createTokens(id: number): Promise<string> {
    const access = this.createToken(
      id,
      this.configService.get<string>('ACCESS_EXPIRES'),
    );
    const refresh = this.createToken(
      id,
      this.configService.get<string>('REFRESH_EXPIRES'),
    );
    await this.tokenRepository.save({ access, refresh });
    return access;
  }

  /**
   * @returns access jwt token
   */
  async updateTokens(access: string): Promise<string | null> {
    const oldTokens = await this.tokenRepository.findOne({ access });
    if (!oldTokens) {
      return null;
    }
    const newAccess = oldTokens.refresh;
    await this.tokenRepository.remove(oldTokens);
    const refresh = this.createToken(
      this.decodeToken(newAccess).userId,
      this.configService.get<string>('REFRESH_EXPIRES'),
    );
    await this.tokenRepository.save({ access: newAccess, refresh });
    return newAccess;
  }

  private createToken(id: number, expiresIn: string): string {
    return this.jwtService.sign(
      { userId: id },
      {
        expiresIn,
      },
    );
  }

  decodeToken(token: string): TokenBody {
    const decoded = this.jwtService.decode(token);
    return typeof decoded === 'string' ? JSON.parse(decoded) : decoded;
  }

  async checkToken(token: string): Promise<string | null> {
    const { exp } = this.decodeToken(token);
    if (!exp) {
      return null;
    }
    return Date.now() >= exp * 1000 ? this.updateTokens(token) : token;
  }
}
