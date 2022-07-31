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
    const { text, chatId, from, file } = createMessageDto;
    console.log(file);
    return this.repository.save({
      text,
      from,
      chat: { id: chatId },
      file: file ? { id: file } : undefined,
    });
  }

  getByChatId(
    chatId: number,
    take: number,
    page: number,
  ): Promise<MessageEntity[]> {
    return this.repository.find({
      where: {
        chat: { id: chatId },
      },
      take,
      skip: take * page,
      relations: {
        file: true,
      },
      select: {
        file: {
          id: true,
          name: true,
        },
      },
    });
  }
}
