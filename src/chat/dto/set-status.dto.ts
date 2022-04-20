import { ChatStatus } from '../entities/chat.entity';

export class SetStatusDto {
  readonly id: number;
  readonly status: ChatStatus;
}
