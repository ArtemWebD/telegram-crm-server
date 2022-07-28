import {
  Body,
  Controller,
  Delete,
  Get,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthorizationGuard, IUserData } from 'src/auth/auth.guard';
import { DeleteDto } from 'src/common/delete.dto';
import { ChatRepository } from './chat.repository';
import { ChatEntity } from './entities/chat.entity';

@UseGuards(AuthorizationGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatRepository: ChatRepository) {}

  @Get()
  getChats(
    @Req() req: Request,
    @Query('take') take: string,
    @Query('page') page: string,
  ): Promise<ChatEntity[]> {
    const user = req.user as IUserData;
    return this.chatRepository.getByUser(user.id, +take, +page);
  }

  @Delete()
  async remove(@Body() deleteDto: DeleteDto): Promise<void> {
    await this.chatRepository.remove(deleteDto.id);
  }
}
