import * as uuid from 'uuid';
import * as path from 'path';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ChatRepository } from 'src/chat/chat.repository';
import { FileDto } from 'src/file/dto/file.dto';
import { FileEntity } from 'src/file/entities/file.entity';
import { FileService } from 'src/file/file.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { MessageEntity, MessageFrom } from './entities/message.entity';
import { MessageRepository } from './message.repository';
import { IChatJoinRequest, IPhoto, IUpdate } from './update.type';
import axios, { AxiosResponse } from 'axios';
import { TELEGRAM_URL } from 'src/common/constants';
import { BotRepository } from 'src/bot/bot.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly fileService: FileService,
    private readonly chatRepository: ChatRepository,
    private readonly botRepository: BotRepository,
    private readonly configService: ConfigService,
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
      await this.sendBotMessage(
        sendMessageDto.token,
        chat.chatId,
        sendMessageDto.text,
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

  async chatJoinRequestHandler(
    token: string,
    chatJoinRequest: IChatJoinRequest,
  ): Promise<void> {
    const bot = await this.botRepository.getByToken(token);
    const isChatMember = await this.checkChatMember(
      token,
      chatJoinRequest.chat.id,
      chatJoinRequest.from.id,
    );
    if (!bot.approveRequests || isChatMember) {
      return;
    }
    await this.approveChatJoinRequest(
      token,
      chatJoinRequest.chat.id,
      chatJoinRequest.from.id,
    );
    if (bot.chatJoinRequestText) {
      bot.chatJoinRequestImage
        ? await this.sendBotPhoto(
            token,
            bot.chatJoinRequestImage,
            chatJoinRequest.from.id,
            bot.chatJoinRequestText,
          )
        : await this.sendBotMessage(
            token,
            chatJoinRequest.from.id,
            bot.chatJoinRequestText,
          );
    }
  }

  private async checkChatMember(
    token: string,
    chatId: number,
    userId: number,
  ): Promise<boolean> {
    try {
      return !!(await axios.get(
        TELEGRAM_URL +
          `/bot${token}/getChatMember?chat_id=${chatId}&user_id=${userId}`,
      ));
    } catch (error) {
      return false;
    }
  }

  private approveChatJoinRequest(
    token: string,
    chatId: number,
    userId: number,
  ): Promise<AxiosResponse> {
    return axios.get(
      TELEGRAM_URL +
        `/bot${token}/approveChatJoinRequest?chat_id=${chatId}&user_id=${userId}`,
    );
  }

  private sendBotMessage(
    token: string,
    userId: number,
    text: string,
  ): Promise<AxiosResponse> {
    return axios.get(
      TELEGRAM_URL +
        `/bot${token}/sendMessage?chat_id=${userId}&text=${encodeURIComponent(
          text,
        )}`,
    );
  }

  private async sendBotPhoto(
    token: string,
    file: FileEntity,
    userId: number,
    caption?: string,
  ): Promise<AxiosResponse> {
    const photoPath = this.configService.get('URL') + `/${file.data}`;
    return axios.get(
      TELEGRAM_URL +
        `/bot${token}/sendPhoto?chat_id=${userId}&photo=${photoPath}&caption=${
          encodeURIComponent(caption) || ''
        }`,
    );
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
