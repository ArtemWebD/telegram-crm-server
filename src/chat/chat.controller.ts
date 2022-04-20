import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from 'src/token/jwt.guard';
import { UpdateResult } from 'typeorm';
import { ChatService } from './chat.service';
import { AddChatDto } from './dto/add-chat.dto';
import { SetStatusDto } from './dto/set-status.dto';
import { ChatEntity } from './entities/chat.entity';
import { imageFilter } from './image.filter';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: imageFilter,
      limits: {
        fileSize: 1_485_760,
      },
    }),
  )
  async add(
    @Body() addChatDto: AddChatDto,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<void> {
    console.log('BODY ', addChatDto);
    await this.chatService.addChat(addChatDto, image?.buffer);
  }

  @UseGuards(JwtGuard)
  @Get()
  getChats(@Query('skip') skip?: number): Promise<ChatEntity[]> {
    return this.chatService.getChats(skip);
  }

  @UseGuards(JwtGuard)
  @Delete()
  async deleteChat(@Query('id') id: number): Promise<void> {
    await this.chatService.deleteChat(id);
  }

  @UseGuards(JwtGuard)
  @Put()
  setStatus(@Body() setStatusDto: SetStatusDto): Promise<UpdateResult> {
    return this.chatService.setStatus(setStatusDto);
  }
}
