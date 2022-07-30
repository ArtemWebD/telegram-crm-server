import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotModule } from 'src/bot/bot.module';
import { ChatModule } from 'src/chat/chat.module';
import { FileModule } from 'src/file/file.module';
import { TokenModule } from 'src/token/token.module';
import { MessageEntity } from './entities/message.entity';
import { MessageController } from './message.controller';
import { MessageRepository } from './message.repository';
import { MessageService } from './message.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageEntity]),
    FileModule,
    TokenModule,
    BotModule,
    ChatModule,
  ],
  controllers: [MessageController],
  providers: [MessageService, MessageRepository],
})
export class MessageModule {}
