export interface IUpdate {
  update_id: number;
  message?: ITelegramMessage;
  chat_join_request?: IChatJoinRequest;
}

export interface ITelegramMessage {
  message_id: number;
  from: IFrom;
  chat: IChat;
  date: number;
  text?: string;
  caption?: string;
  photo?: IPhoto[];
}

interface IChatJoinRequest {
  chat: IChannel;
  from: IFrom;
  date: number;
}

export interface IFrom {
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

interface IChannel {
  id: number;
  title: string;
  type: string;
}

export interface IPhoto {
  file_id: number;
}
