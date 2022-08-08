import {
  Body,
  Controller,
  Delete,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthorizationGuard } from 'src/auth/auth.guard';
import { DeleteDto } from 'src/common/delete.dto';
import { ChatRepository, IChats } from './chat.repository';

@UseGuards(AuthorizationGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatRepository: ChatRepository) {}

  @Get()
  getChats(
    @Query('take') take: string,
    @Query('page') page: string,
    @Query('botId') botId: string,
  ): Promise<IChats> {
    return this.chatRepository.getByBot(+botId, +take, +page);
  }

  @Delete()
  async remove(@Body() deleteDto: DeleteDto): Promise<void> {
    await this.chatRepository.remove(deleteDto.id);
  }
}
