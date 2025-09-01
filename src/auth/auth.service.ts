import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    try {
      const user = await this.userService.findOneByUsername(username);
      if (!user) throw new BadRequestException();

      const comparePass = await bcrypt.compare(password, user.password);
      if (!comparePass) throw new BadRequestException();

      const payload = { username: user.username, sub: user.id };
      return {
        refresh_token: await this.jwtService.signAsync(payload, {
          expiresIn: '7d',
        }),
        auth: {
          access_token: await this.jwtService.signAsync(payload, {
            expiresIn: '15m',
          }),
          user: { username: user.username, userId: user.id },
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async register(user: { username: string; password: string }) {
    try {
      const saltRounds = 10;
      const hashPass = await bcrypt.hash(user.password, saltRounds);
      await this.userService.create({
        username: user.username,
        password: hashPass,
      });
    } catch (error) {
      throw error;
    }
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      if (!refreshToken) throw new BadRequestException('token inexistente');

      const isValid = await this.jwtService.verify(refreshToken);

      if (!isValid) throw new BadRequestException('hubo un error');

      const payload = await this.jwtService.decode(refreshToken);

      const { exp, iat, ...rest } = payload;

      return {
        auth: {
          access_token: await this.jwtService.signAsync(rest, {
            expiresIn: '15m',
          }),
          user: { username: payload.username, userId: payload.sub },
        },
      };
    } catch (error) {
      throw error;
    }
  }
}
