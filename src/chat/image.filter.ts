import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';

enum ImageMimeTypes {
  png = 'image/png',
  gif = 'image/gif',
  jpeg = 'image/jpeg',
  svg = 'image/svg',
}

export const imageFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: (n: any, flag?: boolean) => any,
) => {
  //@ts-ignore
  Object.values(ImageMimeTypes).includes(file.mimetype)
    ? cb(null, true)
    : cb(new HttpException('Некорректный файл', HttpStatus.BAD_REQUEST));
};
