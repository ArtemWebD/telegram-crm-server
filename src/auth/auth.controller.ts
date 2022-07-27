import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(authService: AuthService) {}

  @UseGuards(AuthGuard('register'))
  @Post('register')
  async register() {}

  @UseGuards(AuthGuard('login'))
  @Post('login')
  async login() {}

  @Get('logout')
  logout() {}

  @Post('refresh')
  refresh() {}
}
