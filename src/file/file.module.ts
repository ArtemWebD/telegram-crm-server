import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenModule } from 'src/token/token.module';
import { FileEntity } from './entities/file.entity';
import { FileController } from './file.controller';
import { FileRepository } from './file.repository';
import { FileService } from './file.service';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity]), TokenModule],
  controllers: [FileController],
  providers: [FileService, FileRepository],
  exports: [FileRepository, FileService],
})
export class FileModule {}
