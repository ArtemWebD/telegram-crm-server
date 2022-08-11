import * as sharp from 'sharp';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OptimizerService {
  async optimize(file: Buffer): Promise<Buffer> {
    const image = sharp(file);
    const { format } = await image.metadata();
    if (format !== 'jpeg') {
      image.toFormat('jpeg');
    }
    await image.jpeg({
      mozjpeg: true,
      quality: 80,
    });
    return image.toBuffer();
  }
}
