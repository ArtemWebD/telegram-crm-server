import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { RegisterStrategy } from './register.strategy';
import { LoginStrategy } from './login.strategy';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [UserModule, PassportModule, TokenModule],
  providers: [AuthService, RegisterStrategy, LoginStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
