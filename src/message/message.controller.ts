import { Body, Controller, Post } from '@nestjs/common';
import { IUpdate } from './update.type';

@Controller('message')
export class MessageController {
  @Post('/:token')
  botHandler(@Body() update: IUpdate) {}
}
