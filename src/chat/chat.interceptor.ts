import * as uuid from 'uuid';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { BotRepository } from 'src/bot/bot.repository';
import { FileDto } from 'src/file/dto/file.dto';
import { FileService } from 'src/file/file.service';
import { IFrom, IUpdate } from 'src/message/update.type';
import { ChatRepository } from './chat.repository';
import { ChatEntity } from './entities/chat.entity';

/**
 * The interceptor checking the presence of a chat. If this is not, then a new chat is created
 */
@Injectable()
export class ChatInterceptor implements NestInterceptor {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly botRepository: BotRepository,
    private readonly fileService: FileService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req: Request = context.switchToHttp().getRequest();
    const body = req.body as IUpdate;
    const from: IFrom | undefined =
      body.message?.from || body.chat_join_request?.from;
    console.log(from);
    if (!from) {
      return next.handle();
    }
    const isExist = await this.chatRepository.isExist(from.id);
    if (!isExist) {
      await this.createChat(req.params.token, from);
    }
    return next.handle();
  }

  private async createChat(token: string, from: IFrom): Promise<ChatEntity> {
    const bot = await this.botRepository.getByToken(token);
    const image = await this.fileService.getUserPhoto(from.id, token);
    const photo = image
      ? await this.fileService.saveUserPhoto(
          new FileDto(`${uuid.v4()}.jpg`, 'image/jpg', ''),
          image,
        )
      : undefined;
    return this.chatRepository.save(
      bot.id,
      from.id,
      from.first_name,
      from.last_name,
      from.username,
      photo,
    );
  }
}
