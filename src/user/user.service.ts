import * as bcrypt from 'bcryptjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { EditDataDto } from './dto/edit-data.dto';

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

  async checkPassword(
    enteredPassword: string,
    rightPassword?: string | null,
    id?: number,
  ): Promise<boolean> {
    if (!rightPassword) {
      const { password } = await this.userRepository.findOne(id);
      rightPassword = password;
    }
    return bcrypt.compare(enteredPassword, rightPassword);
  }

  async update(editDataDto: EditDataDto): Promise<UpdateResult> {
    const { userId, login, oldPassword } = editDataDto;
    let newPassword = editDataDto.newPassword;
    const isCompare = await this.checkPassword(oldPassword, null, userId);
    if (!isCompare) {
      throw new HttpException('Пароли не совпадают', HttpStatus.FORBIDDEN);
    }
    if (newPassword) {
      newPassword = await bcrypt.hash(newPassword, 12);
    }
    return this.userRepository.update(
      { id: userId },
      {
        ...(login && { login }),
        ...(newPassword && { password: newPassword }),
      },
    );
  }
}
