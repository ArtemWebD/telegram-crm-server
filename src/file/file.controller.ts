import {
  Controller,
  Get,
  Query,
  StreamableFile,
  Response,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { FileService } from './file.service';

@SkipThrottle()
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get()
  async getFile(
    @Query('id') id: number,
    @Response({ passthrough: true }) res,
  ): Promise<StreamableFile> {
    const { data, mimetype, filename } = await this.fileService.getFile(id);
    res.set({
      'Content-Type': mimetype,
      'Content-Disposition': `attachment; filename=${filename}`,
    });
    return new StreamableFile(Buffer.from(data));
  }
}
