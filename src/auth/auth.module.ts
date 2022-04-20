import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/token/jwt.strategy';
import { TokenModule } from 'src/token/token.module';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginStrategy } from './login.strategy';
import { RegisterStrategy } from './register.strategy';

@Module({
  imports: [UserModule, PassportModule, TokenModule],
  controllers: [AuthController],
  providers: [AuthService, RegisterStrategy, LoginStrategy, JwtStrategy],
})
export class AuthModule {}
