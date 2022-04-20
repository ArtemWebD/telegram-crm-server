import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from 'src/token/jwt.guard';
import { AddMessageDto } from './dto/add-message.dto';
import { MessageEntity } from './entities/message.entity';
import { MessageGateway } from './message.gateway';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly messageGateway: MessageGateway,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async add(
    @Body() addMessageDto: AddMessageDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<MessageEntity> {
    const message = await this.messageService.addMessage(addMessageDto, file);
    this.messageGateway.handleMessage(message);
    return message;
  }

  @UseGuards(JwtGuard)
  @Get()
  get(@Query('chat') chatId: number): Promise<MessageEntity[]> {
    return this.messageService.getMessages(chatId);
  }
}
