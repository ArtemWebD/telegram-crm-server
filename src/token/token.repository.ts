import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { TokenEntity } from './entities/token.entity';

@Injectable()
export class TokenRepository {
  constructor(
    @InjectRepository(TokenEntity)
    private readonly repository: Repository<TokenEntity>,
  ) {}

  async save(userId: number, refreshToken: string): Promise<TokenEntity> {
    const tokenData = await this.repository.findOneBy({ user: { id: userId } });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      await this.repository.update(tokenData.id, { refreshToken });
      return {
        ...tokenData,
        refreshToken,
      };
    }
    return this.repository.save({
      refreshToken,
      user: { id: userId },
    });
  }
}
