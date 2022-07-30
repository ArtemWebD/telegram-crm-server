import { Injectable } from '@nestjs/common';
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
  ) {}

  async create(update: IUpdate, token: string): Promise<MessageEntity> {
    const image = update.message.photo
      ? [...(await this.getPhotos(update.message.photo, token))]
      : undefined;
    const text = update.message.text || update.message.caption;
    const createMessageDto = new CreateMessageDto(
      text,
      MessageFrom.user,
      update.message.from.id,
      image,
    );
    return this.messageRepository.save(createMessageDto);
  }

  send(sendMessageDto: SendMessageDto): Promise<MessageEntity> {
    const createMessageDto = new CreateMessageDto(
      sendMessageDto.text,
      MessageFrom.bot,
      sendMessageDto.chatId,
    );
    return this.messageRepository.save(createMessageDto);
  }

  private getPhotos(photos: IPhoto[], token: string): Promise<Buffer> {
    const fileId = photos[photos.length - 1].file_id;
    return this.fileService.getPhoto(fileId, token);
  }
}
