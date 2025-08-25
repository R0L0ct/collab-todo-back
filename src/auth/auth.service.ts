import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
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
      const comparePass = await bcrypt.compare(password, user.password);
      if (!comparePass || !user) throw new BadRequestException();

      const payload = { username: user.username, sub: user.id };
      return {
        refresh_token: await this.jwtService.signAsync(payload, {
          expiresIn: '7d',
        }),
        auth: {
          access_token: await this.jwtService.signAsync(payload, {
            expiresIn: '15m',
          }),
          user: user.username,
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
}
