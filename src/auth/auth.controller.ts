import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { IUser } from './register.strategy';

export interface IAccessToken {
  accessToken: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('register'))
  @Post('register')
  async register(@Req() req: Request, @Res() res: Response): Promise<void> {
    const user = req.user as IUser;
    const tokens = await this.authService.register(user);
    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.json({ accessToken: tokens.accessToken });
  }

  @UseGuards(AuthGuard('login'))
  @Post('login')
  async login() {}

  @Get('logout')
  logout() {}

  @Post('refresh')
  refresh() {}
}
