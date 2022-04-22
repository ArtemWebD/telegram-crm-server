export class EditDataDto {
  readonly userId: number;
  readonly login?: string;
  readonly oldPassword: string;
  newPassword?: string;
}
