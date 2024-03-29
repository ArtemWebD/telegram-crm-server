import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { TokenEntity } from './entities/token.entity';

@Injectable()
export class TokenRepository {
  constructor(
    @InjectRepository(TokenEntity)
    private readonly repository: Repository<TokenEntity>,
  ) {}

  async save(user: UserEntity, refreshToken: string): Promise<TokenEntity> {
    const tokenData = await this.repository.findOneBy({
      user: { id: user.id },
    });
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
      user: { id: user.id },
    });
  }

  remove(refreshToken: string): Promise<DeleteResult> {
    return this.repository.delete({ refreshToken });
  }

  findRefresh(refreshToken: string) {
    return this.repository.findOneBy({ refreshToken });
  }
}
