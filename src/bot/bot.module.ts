import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotController } from './bot.controller';
import { BotRepository } from './bot.repository';
import { BotService } from './bot.service';
import { BotEntity } from './entities/bot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BotEntity])],
  controllers: [BotController],
  providers: [BotService, BotRepository],
})
export class BotModule {}
