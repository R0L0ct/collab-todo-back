import { Body, Controller, Post, Response } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() user: { username: string; password: string },
    @Response() res: any,
  ): Promise<any> {
    try {
      const response = await this.authService.login(
        user.username,
        user.password,
      );
      const { refresh_token } = response;

      await res.cookie('todo_refresh', refresh_token, {
        httpOnly: true,
        secure: false,
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  @Post('register')
  async register(
    @Body() user: { username: string; password: string },
  ): Promise<any> {
    try {
      const response = await this.authService.register(user);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
