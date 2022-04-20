import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  findOne(id: number): Promise<UserEntity> {
    return this.userRepository.findOne(id);
  }

  findByLogin(login: string): Promise<UserEntity> {
    return this.userRepository.findOne({ login });
  }

  async createUser(login: string, password: string): Promise<UserEntity> {
    password = await bcrypt.hash(password, 12);
    return this.userRepository.save({ login, password });
  }

  checkPassword(
    enteredPassword: string,
    rightPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(enteredPassword, rightPassword);
  }

  async update(
    id: number,
    name?: string,
    password?: string,
  ): Promise<UpdateResult> {
    if (password) {
      password = await bcrypt.hash(password, 12);
    }
    return this.userRepository.update(
      { id },
      {
        ...(name && { name }),
        ...(password && { password }),
      },
    );
  }
}
