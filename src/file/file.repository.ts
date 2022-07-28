import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileDto } from './dto/file.dto';
import { FileEntity } from './entities/file.entity';

@Injectable()
export class FileRepository {
  constructor(
    @InjectRepository(FileEntity)
    private readonly repository: Repository<FileEntity>,
  ) {}

  save(file: FileDto): Promise<FileEntity> {
    return this.repository.save({
      ...file,
    });
  }

  getById(id: number): Promise<FileEntity> {
    return this.repository.findOneBy({ id });
  }
}
