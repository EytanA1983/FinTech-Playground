import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('health')
  health() {
    return { status: 'ok' };
  }

  @Post('login')
  login(@Body('userId') userId: string) {
    return this.authService.login(userId);
  }

  @Get('demo-token')
  demoToken() {
    const token = this.authService.login('demo-user');
    return { access_token: token };
  }
}
