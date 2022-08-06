import * as uuid from 'uuid';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ChatRepository } from 'src/chat/chat.repository';
import { FileDto } from 'src/file/dto/file.dto';
import { FileEntity } from 'src/file/entities/file.entity';
import { FileService } from 'src/file/file.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { MessageEntity, MessageFrom } from './entities/message.entity';
import { MessageRepository } from './message.repository';
import { IPhoto, IUpdate } from './update.type';
import axios from 'axios';
import { TELEGRAM_URL } from 'src/common/constants';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly fileService: FileService,
    private readonly chatRepository: ChatRepository,
  ) {}

  async create(update: IUpdate, token: string): Promise<MessageEntity> {
    try {
      const file = await this.getFile(
        update.message.photo,
        token,
        update.message.from.id,
      );
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
      const msg = await this.messageRepository.save(createMessageDto);
      return this.messageRepository.getById(msg.id);
    } catch (error) {
      console.log(error);
    }
  }

  async send(sendMessageDto: SendMessageDto): Promise<MessageEntity> {
    try {
      const chat = await this.chatRepository.getById(sendMessageDto.chatId);
      const createMessageDto = new CreateMessageDto(
        sendMessageDto.text,
        MessageFrom.bot,
        sendMessageDto.chatId,
      );
      await axios.get(
        TELEGRAM_URL +
          `/bot${sendMessageDto.token}/sendMessage?chat_id=${
            chat.chatId
          }&text=${encodeURIComponent(sendMessageDto.text)}`,
      );
      return this.messageRepository.save(createMessageDto);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Не удалось отправить сообщение, попробуйте снова',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async getFile(
    photo: IPhoto[] | undefined,
    token: string,
    chatId: number,
  ): Promise<FileEntity | undefined> {
    const image = photo ? await this.getPhotos(photo, token) : undefined;
    if (!image) {
      return undefined;
    }
    return this.fileService.saveMessagePhoto(
      new FileDto(`${uuid.v4()}.jpg`, 'image/jpg', ''),
      image,
      chatId,
    );
  }

  private getPhotos(photos: IPhoto[], token: string): Promise<Buffer> {
    const fileId = photos[photos.length - 1].file_id;
    return this.fileService.getPhoto(fileId, token);
  }
}
