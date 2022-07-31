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
import { SendMessageDto } from './dto/send-message.dto';
import { MessageEntity } from './entities/message.entity';
import { MessageRepository } from './message.repository';
import { MessageService } from './message.service';
import { IUpdate } from './update.type';

@Controller('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly messageRepository: MessageRepository,
  ) {}

  @UseInterceptors(ChatInterceptor)
  @Post('/:token')
  botHandler(@Body() update: IUpdate, @Param('token') token: string) {
    console.log(update);
    return this.messageService.create(update, token);
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
  ): Promise<MessageEntity[]> {
    return this.messageRepository.getByChatId(+chatId, +take, +page);
  }
}
