import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileEntity } from './entities/file.entity';

@Injectable()
export class FileRepository {
  constructor(
    @InjectRepository(FileEntity)
    private readonly repository: Repository<FileEntity>,
  ) {}

  save(name: string, mimetype: string, data: Buffer): Promise<FileEntity> {
    return this.repository.save({
      name,
      mimetype,
      data: [...data],
    });
  }

  getById(id: number): Promise<FileEntity> {
    return this.repository.findOneBy({ id });
  }
}
