import {
  Body,
  Controller,
  Post,
  UseGuards,
  Response,
  Get,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import express from 'express';
import { JwtGuard } from 'src/token/jwt.guard';
import { TokenBody } from 'src/token/token.service';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(AuthGuard('register'))
  @Post('register')
  async register(@Body() authDto: AuthDto): Promise<{ message: string }> {
    await this.authService.createUser(authDto);
    return { message: 'Пользователь успешно создан' };
  }

  @UseGuards(AuthGuard('login'))
  @Post('login')
  async login(
    @Body() tokenBody: TokenBody,
    @Response() res: express.Response,
  ): Promise<void> {
    const token = await this.authService.login(tokenBody);
    res
      .status(200)
      .cookie('token', token, {
        httpOnly: true,
        domain: this.configService.get<string>('COOKIE_DOMAIN'),
        expires: new Date(Date.now() + 1000 * 60 * 60 * 36),
        secure: true,
        sameSite: false,
      })
      .send();
  }

  @UseGuards(JwtGuard)
  @Get()
  auth() {
    return;
  }
}
