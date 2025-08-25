import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Response,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() user: { username: string; password: string },
    @Response({ passthrough: true }) res: any, //passthrough es necesario para poder alojar el token en las cookies
  ): Promise<any> {
    try {
      const response = await this.authService.login(
        user.username,
        user.password,
      );

      const { refresh_token, auth } = response;

      await res.cookie('todo_refresh', refresh_token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
      });

      return auth;
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

  @Get('refresh-token')
  async refreshAccessToken(@Request() req: any) {
    try {
      const token = req.cookies['todo_refresh'];
      if (!token) {
        throw new UnauthorizedException('No refresh token found');
      }

      const response = await this.authService.refreshAccessToken(token);

      return response.auth;
    } catch (error) {
      throw error;
    }
  }
}
