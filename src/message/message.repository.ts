import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageEntity } from './entities/message.entity';

export interface IMessages {
  messages: MessageEntity[];
  count: number;
}

@Injectable()
export class MessageRepository {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly repository: Repository<MessageEntity>,
  ) {}

  save(createMessageDto: CreateMessageDto): Promise<MessageEntity> {
    const { text, chatId, from, file } = createMessageDto;
    return this.repository.save({
      text,
      from,
      chat: { id: chatId },
      file: file ? { id: file } : undefined,
    });
  }

  async getByChatId(
    chatId: number,
    take: number,
    page: number,
  ): Promise<IMessages> {
    const messages = await this.repository.find({
      where: {
        chat: { id: chatId },
      },
      take,
      skip: take * page,
      relations: {
        file: true,
        chat: true,
      },
      order: {
        createdAt: 'DESC',
      },
      select: {
        file: {
          data: true,
          mimetype: true,
          id: true,
        },
        chat: {
          id: true,
        },
      },
    });
    const count = await this.repository.countBy({ chat: { id: chatId } });
    return {
      messages,
      count,
    };
  }

  getById(id: number): Promise<MessageEntity> {
    return this.repository.findOne({
      where: {
        id,
      },
      relations: {
        file: true,
        chat: true,
      },
      select: {
        file: {
          data: true,
          mimetype: true,
          id: true,
        },
        chat: {
          id: true,
        },
      },
    });
  }
}
