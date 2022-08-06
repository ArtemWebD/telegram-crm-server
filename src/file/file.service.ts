import * as https from 'https';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { TELEGRAM_URL } from 'src/common/constants';
import { FileRepository } from './file.repository';
import { FileDto } from './dto/file.dto';
import { FileEntity } from './entities/file.entity';
import { OptimizerService } from 'src/optimizer/optimizer.service';

/**
 * Class responsible for receiving files from Telegram
 */
@Injectable()
export class FileService {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly optimizerService: OptimizerService,
  ) {}

  async saveUserPhoto(file: FileDto, binary: Buffer): Promise<FileEntity> {
    const dirPath = path.resolve(
      __dirname,
      `../static/users/${file.name.slice(0, 2)}`,
    );
    await this.savePhoto(dirPath, file, binary);
    file.data = `static/users/${file.name.slice(0, 2)}/${file.name}`;
    return this.fileRepository.save(file);
  }

  async saveMessagePhoto(
    file: FileDto,
    binary: Buffer,
    chatId: number,
  ): Promise<FileEntity> {
    const dirPath = path.resolve(
      __dirname,
      `../static/messages/${chatId}/${file.name.slice(0, 2)}`,
    );
    await this.savePhoto(dirPath, file, binary);
    file.data = `static/messages/${chatId}/${file.name.slice(0, 2)}/${
      file.name
    }`;
    return this.fileRepository.save(file);
  }

  async getUserPhoto(
    chatId: number,
    token: string,
  ): Promise<Buffer | undefined> {
    const res = await axios.get(
      TELEGRAM_URL + `/bot${token}/getUserProfilePhotos?user_id=${chatId}`,
    );
    const userProfilePhotos = res.data.result.photos;
    if (!userProfilePhotos.length) {
      return undefined;
    }
    const photoArray = userProfilePhotos[0];
    const fileId = photoArray[photoArray.length - 1].file_id;
    const { data } = await axios.get(
      TELEGRAM_URL + `/bot${token}/getFile?file_id=${fileId}`,
    );
    return this.parseFile(token, data.result.file_path);
  }

  async getPhoto(fileId: number, token: string): Promise<Buffer> {
    const { data } = await axios.get(
      TELEGRAM_URL + `/bot${token}/getFile?file_id=${fileId}`,
    );
    return this.parseFile(token, data.result.file_path);
  }

  private async parseFile(token: string, filePath: string): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      https.get(TELEGRAM_URL + `/file/bot${token}/${filePath}`, (res) => {
        const chunks = [];
        res.on('data', (data: Buffer) => {
          if (data) {
            chunks.push(...data);
          }
        });
        res.on('end', () => {
          resolve(Buffer.from(chunks));
        });
        res.on('error', (err) => reject(err));
      });
    });
  }

  private async savePhoto(
    dirPath: string,
    file: FileDto,
    binary: Buffer,
  ): Promise<void> {
    try {
      await fs.access(dirPath);
    } catch (error) {
      await fs.mkdir(dirPath, { recursive: true });
    }
    const filePath = path.join(dirPath, file.name);
    binary = await this.optimizerService.optimize(binary);
    return fs.writeFile(filePath, binary);
  }
}
