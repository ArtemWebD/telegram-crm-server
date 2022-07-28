import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenModule } from 'src/token/token.module';
import { BotController } from './bot.controller';
import { BotRepository } from './bot.repository';
import { BotService } from './bot.service';
import { BotEntity } from './entities/bot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BotEntity]), ConfigModule, TokenModule],
  controllers: [BotController],
  providers: [BotService, BotRepository],
})
export class BotModule {}
