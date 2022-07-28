import axios from 'axios';
import { Injectable } from '@nestjs/common';
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
    const { token } = createBotDto;
    const botInfo = await axios.get(TELEGRAM_URL + `/bot${token}/getMe`);
    const { first_name, username } = botInfo.data.result;
    const bot = await this.botRepository.save(
      token,
      first_name,
      username,
      userId,
    );
    delete bot.user;
    await axios.post(
      TELEGRAM_URL +
        `/bot${token}/setWebhook?url=${this.configService.get(
          'URL',
        )}/bot/${token}`,
    );
    return bot;
  }

  async remove(id: number): Promise<DeleteResult> {
    const { token } = await this.botRepository.getById(id);
    await axios.post(TELEGRAM_URL + `/bot${token}/deleteWebhook`);
    return this.botRepository.remove(id);
  }
}
