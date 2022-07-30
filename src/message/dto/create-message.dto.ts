import { MessageFrom } from '../entities/message.entity';

export class CreateMessageDto {
  constructor(
    public text: string | undefined,
    public from: MessageFrom,
    public chatId: number,
    public files?: number[],
  ) {}
}
