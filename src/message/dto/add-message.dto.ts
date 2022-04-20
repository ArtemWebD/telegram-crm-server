import { MessageFrom } from '../entities/message.entity';

export class AddMessageDto {
  readonly chatId: number;
  readonly from: MessageFrom;
  readonly text: string;
  readonly buttonText?: string;
  readonly manualSending?: boolean;
  readonly fileWidth?: number;
  readonly fileHeight?: number;
}
