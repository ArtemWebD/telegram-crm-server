import * as uuid from 'uuid';
import axios, { AxiosResponse } from 'axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BotRepository } from './bot.repository';
import { CreateBotDto } from './dto/create-bot.dto';
import { TELEGRAM_URL } from 'src/common/constants';
import { BotEntity } from './entities/bot.entity';
import { ConfigService } from '@nestjs/config';
import { DeleteResult } from 'typeorm';
import { FileService } from 'src/file/file.service';
import { FileDto } from 'src/file/dto/file.dto';
import { FileEntity } from 'src/file/entities/file.entity';

@Injectable()
export class BotService {
  constructor(
    private readonly botRepository: BotRepository,
    private readonly configService: ConfigService,
    private readonly fileService: FileService,
  ) {}

  async create(
    createBotDto: CreateBotDto,
    userId: number,
    photo?: Buffer,
  ): Promise<BotEntity> {
    try {
      const { token, approveRequests, chatJoinRequestText } = createBotDto;
      const botInfo = await axios.get(TELEGRAM_URL + `/bot${token}/getMe`);
      const { first_name, username } = botInfo.data.result;
      await this.setWebhook(token);
      const file = photo ? await this.savePhoto(photo) : undefined;
      const bot = await this.botRepository.save({
        token,
        first_name,
        username,
        userId,
        fileId: file?.id,
        approveRequests: JSON.parse(approveRequests),
        chatJoinRequestText,
      });
      delete bot.user;
      return bot;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Не удалось соединиться с ботом, удалите все подключенные вебхуки',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: number): Promise<DeleteResult> {
    const { token } = await this.botRepository.getById(id);
    await axios.get(TELEGRAM_URL + `/bot${token}/deleteWebhook`);
    return this.botRepository.remove(id);
  }

  private async setWebhook(token: string): Promise<AxiosResponse> {
    await axios.get(TELEGRAM_URL + `/bot${token}/deleteWebhook`);
    return axios.get(
      TELEGRAM_URL +
        `/bot${token}/setWebhook?url=${this.configService.get(
          'URL',
        )}/message/${token}`,
    );
  }

  private savePhoto(binary: Buffer): Promise<FileEntity> {
    const name = uuid.v4() + '.jpg';
    return this.fileService.saveBotPhoto(
      new FileDto(name, 'image/jpg', ''),
      binary,
    );
  }
}
