import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageEntity } from './entities/message.entity';

@Injectable()
export class MessageRepository {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly repository: Repository<MessageEntity>,
  ) {}

  save(createMessageDto: CreateMessageDto): Promise<MessageEntity> {
    const { text, chatId, from, files } = createMessageDto;
    return this.repository.save({
      text,
      from,
      chat: { id: chatId },
      files: files.map((id) => ({ id })),
    });
  }
}
