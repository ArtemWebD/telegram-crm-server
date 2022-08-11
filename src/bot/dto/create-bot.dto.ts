export class CreateBotDto {
  token: string;
  chatJoinRequestText?: string;
  approveRequests?: 'true' | 'false';
}
