import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthorizationGuard } from 'src/auth/auth.guard';
import { ChatInterceptor } from 'src/chat/chat.interceptor';
import { SocketService } from 'src/socket/socket.service';
import { SendMessageDto } from './dto/send-message.dto';
import { MessageEntity } from './entities/message.entity';
import { IMessages, MessageRepository } from './message.repository';
import { MessageService } from './message.service';
import { IUpdate } from './update.type';

@Controller('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly messageRepository: MessageRepository,
    private readonly socketService: SocketService,
  ) {}

  @UseInterceptors(ChatInterceptor)
  @Post('/:token')
  async botHandler(
    @Body() update: IUpdate,
    @Param('token') token: string,
  ): Promise<boolean> {
    const message = await this.messageService.create(update, token);
    return this.socketService.socket.to(token).emit('telegramMessage', message);
  }

  @UseGuards(AuthorizationGuard)
  @Post()
  send(@Body() sendMessageDto: SendMessageDto) {
    return this.messageService.send(sendMessageDto);
  }

  @UseGuards(AuthorizationGuard)
  @Get()
  getMessages(
    @Query('chatId') chatId: string,
    @Query('take') take: string,
    @Query('page') page: string,
  ): Promise<IMessages> {
    return this.messageRepository.getByChatId(+chatId, +take, +page);
  }
}
