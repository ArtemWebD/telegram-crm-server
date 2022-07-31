import { Injectable } from '@nestjs/common';
import { ChatRepository } from 'src/chat/chat.repository';
import { FileDto } from 'src/file/dto/file.dto';
import { FileEntity } from 'src/file/entities/file.entity';
import { FileRepository } from 'src/file/file.repository';
import { FileService } from 'src/file/file.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { MessageEntity, MessageFrom } from './entities/message.entity';
import { MessageRepository } from './message.repository';
import { IPhoto, IUpdate } from './update.type';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly fileService: FileService,
    private readonly fileRepository: FileRepository,
    private readonly chatRepository: ChatRepository,
  ) {}

  async create(update: IUpdate, token: string): Promise<MessageEntity> {
    try {
      const file = await this.getFile(update.message.photo, token);
      const text = update.message.text || update.message.caption;
      const { id } = await this.chatRepository.getByChatId(
        update.message.from.id,
      );
      const createMessageDto = new CreateMessageDto(
        text,
        MessageFrom.user,
        id,
        file ? file.id : undefined,
      );
      return this.messageRepository.save(createMessageDto);
    } catch (error) {
      console.log(error);
    }
  }

  send(sendMessageDto: SendMessageDto): Promise<MessageEntity> {
    const createMessageDto = new CreateMessageDto(
      sendMessageDto.text,
      MessageFrom.bot,
      sendMessageDto.chatId,
    );
    return this.messageRepository.save(createMessageDto);
  }

  private async getFile(
    photo: IPhoto[] | undefined,
    token: string,
  ): Promise<FileEntity | undefined> {
    if (!photo) {
      return undefined;
    }
    const image = photo ? await this.getPhotos(photo, token) : undefined;
    return this.fileRepository.save(
      new FileDto('photo.jpg', 'image/jpg', [...image]),
    );
  }

  private getPhotos(photos: IPhoto[], token: string): Promise<Buffer> {
    const fileId = photos[photos.length - 1].file_id;
    return this.fileService.getPhoto(fileId, token);
  }
}
