import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenEntity } from './entities/token.entity';
import { TokenRepository } from './token.repository';
import { TokenService } from './token.service';

@Module({
  imports: [TypeOrmModule.forFeature([TokenEntity]), JwtModule, ConfigModule],
  providers: [TokenService, TokenRepository],
  exports: [TokenService, TokenRepository],
})
export class TokenModule {}
