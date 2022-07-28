import {
  Controller,
  Get,
  Query,
  Response,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { AuthorizationGuard } from 'src/auth/auth.guard';
import { FileRepository } from './file.repository';

@Controller('file')
export class FileController {
  constructor(private readonly fileRepository: FileRepository) {}

  @UseGuards(AuthorizationGuard)
  @Get('/:id')
  async getFile(
    @Response({ passthrough: true }) res,
    @Query('id') id: string,
  ): Promise<StreamableFile> {
    const fileData = await this.fileRepository.getById(+id);
    res.set({
      'Content-Type': fileData.mimetype,
      'Content-Disposition': `attachment; filename="${fileData.name}"`,
    });
    return new StreamableFile(Buffer.from(fileData.data));
  }
}
