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
import { FileRepository } from 'src/file/file.repository';
import { FileService } from 'src/file/file.service';
import { IUpdate } from 'src/message/update.type';
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
    private readonly fileRepository: FileRepository,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req: Request = context.switchToHttp().getRequest();
    const body = req.body as IUpdate;
    const isExist = await this.chatRepository.isExist(body.message.from.id);
    if (!isExist) {
      await this.createChat(req, body);
    }
    return next.handle();
  }

  private async createChat(req: Request, body: IUpdate): Promise<ChatEntity> {
    const bot = await this.botRepository.getByToken(req.params.token);
    const image = await this.fileService.getUserPhoto(
      body.message.from.id,
      req.params.token,
    );
    const photo = image
      ? await this.fileRepository.save(
          new FileDto('user_photo.jpg', 'image/jpg', [...image]),
        )
      : undefined;
    return this.chatRepository.save(
      bot.id,
      body.message.from.id,
      body.message.from.first_name,
      body.message.from.last_name,
      body.message.from.username,
      photo,
    );
  }
}
