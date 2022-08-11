import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { MessageService } from './message.service';
import { IUpdate } from './update.type';

@Injectable()
export class MessageInterceptor implements NestInterceptor {
  constructor(private readonly messageService: MessageService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest() as Request;
    const update = req.body as IUpdate;
    const token = req.params.token;
    if (update.chat_join_request) {
      await this.messageService.chatJoinRequestHandler(
        token,
        update.chat_join_request,
      );
    }
    return next.handle();
  }
}
