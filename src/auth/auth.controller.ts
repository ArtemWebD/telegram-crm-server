import { Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(authService: AuthService) {}

  @Post('register')
  async register() {}

  @Post('login')
  async login() {}

  @Get('logout')
  logout() {}

  @Post('refresh')
  refresh() {}
}
