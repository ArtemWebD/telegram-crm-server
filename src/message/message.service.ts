import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Repository } from 'typeorm';
import { AddMessageDto } from './dto/add-message.dto';
import { MessageEntity } from './entities/message.entity';
import { FileService } from 'src/file/file.service';

@Injectable()
export class MessageService {
  constructor(
    private readonly fileService: FileService,
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}

  async addMessage(
    addMessageDto: AddMessageDto,
    file?: Express.Multer.File,
  ): Promise<MessageEntity> {
    const { manualSending, ...params } = addMessageDto;
    params.chatId = Number(params.chatId);
    if (manualSending) {
      await axios.get(
        `https://api.telegram.org/bot5194556192:AAGgV47ChBGegqLH_bz7q7jqz-IlL022LHU/sendMessage?chat_id=${
          params.chatId
        }&text=${encodeURI(params.text)}`,
      );
    }
    if (!file) {
      return this.messageRepository.save(params);
    }
    const { id, mimetype } = await this.fileService.saveFile(file);
    const fileStr = JSON.stringify({
      id,
      mimetype,
    });
    const entity = await this.messageRepository.save({
      ...params,
      file: fileStr,
    });
    return this.parseMessageJson(entity);
  }

  async getMessages(chatId: number): Promise<MessageEntity[]> {
    const messages = await this.messageRepository.find({ chatId });
    for (let message of messages) {
      message = this.parseMessageJson(message);
    }
    return messages;
  }

  private parseMessageJson(message: MessageEntity): MessageEntity {
    if (message.buttonText) {
      message.buttonText = JSON.parse(message.buttonText);
    }
    console.log(message.file);
    if (message.file) {
      message.file = JSON.parse(message.file);
    }
    return message;
  }
}
