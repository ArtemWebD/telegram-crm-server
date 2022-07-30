export interface IUpdate {
  update_id: number;
  message: ITelegramMessage;
}

interface ITelegramMessage {
  message_id: number;
  from: IFrom;
  chat: IChat;
  date: number;
  text?: string;
  caption?: string;
}

interface IFrom {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code: string;
}

interface IChat {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  type: string;
}
