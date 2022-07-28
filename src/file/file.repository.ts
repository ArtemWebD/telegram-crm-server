import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatEntity } from 'src/chat/entities/chat.entity';
import { Repository } from 'typeorm';
import { FileEntity } from './entities/file.entity';

interface IRelations {
  chat?: ChatEntity;
}

@Injectable()
export class FileRepository {
  constructor(
    @InjectRepository(FileEntity)
    private readonly repository: Repository<FileEntity>,
  ) {}

  save(
    name: string,
    mimetype: string,
    data: Buffer,
    relations: IRelations,
  ): Promise<FileEntity> {
    return this.repository.save({
      name,
      mimetype,
      data: [...data],
      ...(relations.chat && { chat: relations.chat }),
    });
  }

  getById(id: number): Promise<FileEntity> {
    return this.repository.findOneBy({ id });
  }
}
