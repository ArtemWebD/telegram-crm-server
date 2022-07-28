import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { BotEntity } from './entities/bot.entity';

@Injectable()
export class BotRepository {
  constructor(
    @InjectRepository(BotEntity)
    private readonly repository: Repository<BotEntity>,
  ) {}

  save(
    token: string,
    first_name: string,
    username: string,
    userId: number,
  ): Promise<BotEntity> {
    return this.repository.save({
      token,
      first_name,
      username,
      user: { id: userId },
    });
  }

  getAllByUserId(
    userId: number,
    take: number,
    page: number,
  ): Promise<BotEntity[]> {
    return this.repository.find({
      where: { user: { id: userId } },
      take,
      skip: take * page,
    });
  }

  remove(id: number): Promise<DeleteResult> {
    return this.repository.delete(id);
  }

  update(
    id: number,
    partialEntity: QueryDeepPartialEntity<BotEntity>,
  ): Promise<UpdateResult> {
    return this.repository.update(id, partialEntity);
  }
}
