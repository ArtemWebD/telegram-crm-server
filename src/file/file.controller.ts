import {
  Controller,
  Get,
  Param,
  Query,
  Response,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { AuthorizationGuard } from 'src/auth/auth.guard';
import { FileRepository } from './file.repository';

@Controller('file')
export class FileController {
  constructor(private readonly fileRepository: FileRepository) {}

  @UseGuards(AuthorizationGuard)
  @Get('/:id')
  async getFile(@Response({ passthrough: true }) res, @Param('id') id: string) {
    const fileData = await this.fileRepository.getById(+id);
    // res.set({
    //   'Content-Type': 'image/jpg',
    //   'Content-Disposition': `inline`,
    // });
    return (
      `data:${fileData.mimetype};base64, ` +
      Buffer.from(fileData.data).toString('base64')
    );
  }
}
