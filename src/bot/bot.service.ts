import axios from 'axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BotRepository } from './bot.repository';
import { CreateBotDto } from './dto/create-bot.dto';
import { TELEGRAM_URL } from 'src/common/constants';
import { BotEntity } from './entities/bot.entity';
import { ConfigService } from '@nestjs/config';
import { DeleteResult } from 'typeorm';

@Injectable()
export class BotService {
  constructor(
    private readonly botRepository: BotRepository,
    private readonly configService: ConfigService,
  ) {}

  async create(createBotDto: CreateBotDto, userId: number): Promise<BotEntity> {
    try {
      const { token } = createBotDto;
      const botInfo = await axios.get(TELEGRAM_URL + `/bot${token}/getMe`);
      const { first_name, username } = botInfo.data.result;
      await axios.get(TELEGRAM_URL + `/bot${token}/deleteWebhook`);
      await axios.get(
        TELEGRAM_URL +
          `/bot${token}/setWebhook?url=${this.configService.get(
            'URL',
          )}/message/${token}`,
      );
      const bot = await this.botRepository.save(
        token,
        first_name,
        username,
        userId,
      );
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
}
