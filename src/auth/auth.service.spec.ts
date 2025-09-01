import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../../src/user/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';

jest.mock('bcrypt', () => {
  return { compare: jest.fn() };
});

describe('AuthService', () => {
  let service: AuthService;
  let userService: Partial<Record<keyof UserService, jest.Mock>>; // Uso Partial para definir los metodos necesarios para el test, dejando al resto como opcionales
  let jwtService: Partial<Record<keyof JwtService, jest.Mock>>; // Tambien se puede usar jest.Mocked<T>. Mockea todo el servicio

  beforeEach(async () => {
    userService = {
      findOneByUsername: jest.fn(),
    };
    jwtService = {
      signAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret',
        }),
      ],
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  it('should return tokens and user data when credentials are valid', async () => {
    const mockUser = { id: 1, username: 'test-user', password: 'hashedPass' };
    userService.findOneByUsername.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    /* jest */
    /*   .spyOn(bcrypt, 'compare') */
    /*   .mockResolvedValue(true as unknown as Promise<boolean>); */

    jwtService.signAsync
      .mockResolvedValueOnce('refresh-token')
      .mockReturnValueOnce('access-token');

    const result = await service.login('test-user', 'test123');
    expect(userService.findOneByUsername).toHaveBeenCalledWith('test-user');
    expect(bcrypt.compare).toHaveBeenCalledWith('test123', 'hashedPass');
    expect(result).toEqual({
      refresh_token: 'refresh-token',
      auth: {
        access_token: 'access-token',
        user: { username: 'test-user', userId: 1 },
      },
    });
  });

  it('should throw BadRequestException if user not found', async () => {
    userService.findOneByUsername.mockResolvedValue(null);

    await expect(service.login('wrong-user', 'password')).rejects.toEqual(
      new BadRequestException(),
    );
  });

  it('should throw BadRequestException if password is invalid', async () => {
    const mockUser = { id: 1, username: 'test-user', password: 'hashedPass' };
    userService.findOneByUsername.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(service.login('test-user', 'wrongPass')).rejects.toEqual(
      new BadRequestException(),
    );
  });
});
