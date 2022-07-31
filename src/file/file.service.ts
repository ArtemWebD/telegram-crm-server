import * as https from 'https';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { TELEGRAM_URL } from 'src/common/constants';

/**
 * Class responsible for receiving files from Telegram
 */
@Injectable()
export class FileService {
  async getUserPhoto(
    chatId: number,
    token: string,
  ): Promise<Buffer | undefined> {
    const res = await axios.get(
      TELEGRAM_URL + `/bot${token}/getUserProfilePhotos?user_id=${chatId}`,
    );
    const userProfilePhotos = res.data;
    if (!userProfilePhotos.length) {
      return undefined;
    }
    const photoArray = userProfilePhotos[0];
    const fileId = photoArray[photoArray.length - 1].file_id;
    const { data } = await axios.get(
      TELEGRAM_URL + `/bot${token}/getFile?file_id=${fileId}`,
    );
    return this.parseFile(token, data.file_path);
  }

  async getPhoto(fileId: number, token: string): Promise<Buffer> {
    const { data } = await axios.get(
      TELEGRAM_URL + `/bot${token}/getFile?file_id=${fileId}`,
    );
    return this.parseFile(token, data.file_path);
  }

  private parseFile(token: string, filePath: string): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      https.get(TELEGRAM_URL + `/bot${token}/${filePath}`, (res) => {
        const chunks: number[] = [];
        res.on('data', (data: Buffer) => {
          chunks.push(...Array.from(data));
        });
        res.on('end', () => resolve(Buffer.from(chunks)));
        res.on('error', (err) => reject(err));
      });
    });
  }
}
