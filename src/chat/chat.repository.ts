import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileDto } from 'src/file/dto/file.dto';
import { FileRepository } from 'src/file/file.repository';
import { DeleteResult, Repository } from 'typeorm';
import { ChatEntity } from './entities/chat.entity';

export interface IChats {
  chats: ChatEntity[];
  count: number;
}

@Injectable()
export class ChatRepository {
  constructor(
    @InjectRepository(ChatEntity)
    private readonly repository: Repository<ChatEntity>,
    private readonly fileRepository: FileRepository,
  ) {}

  async isExist(chatId: number): Promise<boolean> {
    return !!(await this.repository.findOneBy({ chatId }));
  }

  async save(
    botId: number,
    chatId: number,
    first_name: string,
    last_name: string | undefined,
    username: string | undefined,
    image?: FileDto,
  ): Promise<ChatEntity> {
    const photo = image ? await this.fileRepository.save(image) : null;
    return this.repository.save({
      chatId,
      first_name,
      last_name,
      username,
      bot: { id: botId },
      ...(photo && { photo }),
    });
  }

  getByChatId(chatId: number): Promise<ChatEntity> {
    return this.repository.findOneBy({ chatId });
  }

  async getByBot(botId: number, take: number, page: number): Promise<IChats> {
    const chats = await this.repository.find({
      where: { bot: { id: botId } },
      take,
      skip: take * page,
      relations: ['photo'],
      select: {
        photo: {
          data: true,
          mimetype: true,
        },
      },
    });
    const count = await this.repository.countBy({ bot: { id: botId } });
    return {
      chats,
      count,
    };
  }

  getById(id: number): Promise<ChatEntity> {
    return this.repository.findOneBy({ id });
  }

  remove(id: number): Promise<DeleteResult> {
    return this.repository.delete(id);
  }
}
