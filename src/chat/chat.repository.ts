import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileDto } from 'src/file/dto/file.dto';
import { FileRepository } from 'src/file/file.repository';
import { UserEntity } from 'src/user/entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { ChatEntity } from './entities/chat.entity';

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
    user: UserEntity,
    chatId: number,
    image?: FileDto,
  ): Promise<ChatEntity> {
    const photo = image ? await this.fileRepository.save(image) : null;
    return this.repository.save({
      chatId,
      user,
      ...(photo && { photo }),
    });
  }

  getByChatId(chatId: number): Promise<ChatEntity> {
    return this.repository.findOneBy({ chatId });
  }

  getByUser(botId: number, take: number, page: number): Promise<ChatEntity[]> {
    return this.repository.find({
      where: { bot: { id: botId } },
      take,
      skip: take * page,
    });
  }

  remove(id: number): Promise<DeleteResult> {
    return this.repository.delete(id);
  }
}
