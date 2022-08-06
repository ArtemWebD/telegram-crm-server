import * as sharp from 'sharp';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OptimizerService {
  async optimize(file: Buffer): Promise<Buffer> {
    console.log(file);
    const image = sharp(file);
    const { format } = await image.metadata();
    if (format !== 'jpeg') {
      return file;
    }
    await image.jpeg({
      mozjpeg: true,
      quality: 80,
    });
    return image.toBuffer();
  }
}
