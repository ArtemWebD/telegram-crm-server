import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthorizationGuard } from 'src/auth/auth.guard';
import { ChatInterceptor } from 'src/chat/chat.interceptor';
import { SendMessageDto } from './dto/send-message.dto';
import { MessageEntity } from './entities/message.entity';
import { MessageService } from './message.service';
import { IUpdate } from './update.type';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseInterceptors(ChatInterceptor)
  @Post('/:token')
  botHandler(@Body() update: IUpdate, @Param('token') token: string) {
    return this.messageService.create(update, token);
  }

  @UseGuards(AuthorizationGuard)
  @Post()
  send(@Body() sendMessageDto: SendMessageDto) {
    return this.messageService.send(sendMessageDto);
  }
}
