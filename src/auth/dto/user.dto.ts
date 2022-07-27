import { UserEntity } from 'src/user/entities/user.entity';

export class UserDto {
  public id: number;
  private login: string;

  constructor(entity: UserEntity) {
    this.id = entity.id;
    this.login = entity.login;
  }
}
