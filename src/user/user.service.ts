import { Injectable } from '@nestjs/common';
import { IUser } from 'src/auth/register.strategy';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  create(user: IUser): Promise<UserEntity> {
    const { login, password } = user;
    return this.userRepository.save(login, password);
  }
}
