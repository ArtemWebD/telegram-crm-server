import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileEntity } from './entities/file.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileEntity: Repository<FileEntity>,
  ) {}

  saveFile(file: Express.Multer.File): Promise<FileEntity> {
    const { buffer, originalname, mimetype } = file;
    return this.fileEntity.save({
      data: [...buffer],
      filename: originalname,
      mimetype,
    });
  }

  getFile(id: number): Promise<FileEntity> {
    return this.fileEntity.findOne(id);
  }
}
