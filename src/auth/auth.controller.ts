import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { UserEntity } from 'src/user/entities/user.entity';
import { AuthorizationGuard } from './auth.guard';
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
    res.cookie('accessToken', tokens.accessToken, {
      maxAge: 30 * 60 * 1000,
      httpOnly: true,
    });
    res.status(200).send();
  }

  @UseGuards(AuthGuard('login'))
  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    const user = req.user as UserEntity;
    const tokens = await this.authService.login(user);
    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.cookie('accessToken', tokens.accessToken, {
      maxAge: 30 * 60 * 1000,
      httpOnly: true,
    });
    res.status(200).send();
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response): Promise<void> {
    const { refreshToken } = req.cookies;
    await this.authService.logout(refreshToken);
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    res.status(200).send();
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response): Promise<void> {
    const { refreshToken } = req.cookies;
    const tokens = await this.authService.refresh(refreshToken);
    res.cookie('accessToken', tokens.accessToken, {
      maxAge: 30 * 60 * 1000,
      httpOnly: true,
    });
    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.status(200).send();
  }
}
