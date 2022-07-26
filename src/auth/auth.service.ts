import * as bcrypt from 'bcryptjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  validateIsExisted(login: string): Promise<boolean> {
    return this.userRepository.isExist(login);
  }

  async validateUser(login: string, password: string): Promise<UserEntity> {
    const user = await this.userRepository.getByLogin(login);
    const isCompare = await bcrypt.compare(password, user.password);
    if (!isCompare) {
      throw new HttpException('User was not found', HttpStatus.BAD_REQUEST);
    }
    return user;
  }
}
