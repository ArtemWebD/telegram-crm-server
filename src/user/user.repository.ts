import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async isExist(login: string): Promise<boolean> {
    const user = await this.repository.findOneBy({ login });
    return !!user;
  }

  async save(login: string, password: string): Promise<UserEntity> {
    const hashed = await bcrypt.hash(password, 10);
    return this.repository.save({
      login,
      password: hashed,
    });
  }
}
