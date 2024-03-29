import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotModule } from 'src/bot/bot.module';
import { FileModule } from 'src/file/file.module';
import { TokenModule } from 'src/token/token.module';
import { ChatController } from './chat.controller';
import { ChatRepository } from './chat.repository';
import { ChatService } from './chat.service';
import { ChatEntity } from './entities/chat.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatEntity]),
    FileModule,
    TokenModule,
    BotModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatRepository],
  exports: [ChatRepository],
})
export class ChatModule {}
