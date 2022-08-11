import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { BotEntity } from './entities/bot.entity';

interface ISaveBot {
  token: string;
  first_name: string;
  username: string;
  userId: number;
  fileId?: number;
  approveRequests?: boolean;
  chatJoinRequestText?: string;
}

@Injectable()
export class BotRepository {
  constructor(
    @InjectRepository(BotEntity)
    private readonly repository: Repository<BotEntity>,
  ) {}

  save(data: ISaveBot): Promise<BotEntity> {
    const {
      token,
      first_name,
      username,
      userId,
      approveRequests,
      chatJoinRequestText,
      fileId,
    } = data;
    return this.repository.save({
      token,
      first_name,
      username,
      approveRequests,
      chatJoinRequestText,
      chatJoinRequestImage: fileId ? { id: fileId } : undefined,
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

  getById(id: number): Promise<BotEntity> {
    return this.repository.findOneBy({ id });
  }

  getByToken(token: string): Promise<BotEntity> {
    return this.repository.findOne({
      where: { token },
      relations: {
        chatJoinRequestImage: true,
      },
      select: {
        chatJoinRequestImage: {
          id: true,
          mimetype: true,
          data: true,
        },
      },
    });
  }
}
