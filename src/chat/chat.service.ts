import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { AddChatDto } from './dto/add-chat.dto';
import { SetStatusDto } from './dto/set-status.dto';
import { ChatEntity } from './entities/chat.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatEntity)
    private readonly chatEntity: Repository<ChatEntity>,
  ) {}

  addChat(addChatDto: AddChatDto, image?: Buffer): Promise<ChatEntity> {
    console.log('CHAT: ', addChatDto);
    return this.chatEntity.save({
      ...addChatDto,
      chatId: Number(addChatDto.chatId),
      ...(image && { image: [...image] }),
    });
  }

  getChats(id = 0): Promise<ChatEntity[]> {
    return this.chatEntity.query(
      `
        SELECT *,
        (SELECT text as message FROM Message WHERE Chat."chatId"=Message."chatId" ORDER BY Message.id DESC LIMIT 1)
        FROM Chat WHERE Chat.id > ${id} LIMIT 100
      `,
    );
  }

  deleteChat(id: number): Promise<DeleteResult> {
    return this.chatEntity.delete(id);
  }

  setStatus(setStatusDto: SetStatusDto): Promise<UpdateResult> {
    return this.chatEntity.update(setStatusDto.id, {
      status: setStatusDto.status,
    });
  }
}
