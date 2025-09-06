import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockResponse = {
    cookie: jest.fn(),
  };

  const mockRequest = {
    cookies: {
      todo_refresh: 'refresh_token',
    },
  };

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
    refreshAccessToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should call service.login and res.cookie', async () => {
    const authServiceResponse = {
      refresh_token: 'refresh-token',
      auth: {
        access_token: 'access-token',
        user: { username: 'test', userId: 1 },
      },
    };

    mockAuthService.login.mockResolvedValue(authServiceResponse);

    const result = await controller.login(
      {
        username: 'test',
        password: 'test123',
      },
      mockResponse,
    );

    expect(service.login).toHaveBeenCalledWith('test', 'test123');
    expect(mockResponse.cookie).toHaveBeenCalledWith(
      'todo_refresh',
      'refresh-token',
      {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    );
    expect(result).toEqual(authServiceResponse.auth);
  });

  it('should call service.register', async () => {
    await controller.register({
      username: 'test',
      password: 'test123',
    });
    expect(service.register).toHaveBeenCalledWith({
      username: 'test',
      password: 'test123',
    });
  });

  describe('Refresh Access Token', () => {
    it('should call service.refreshAccessToken and return a new access token', async () => {
      const mockRefreshResponse = {
        auth: {
          access_token: 'access_token',
          user: { username: 'test', userId: 1 },
        },
      };

      mockAuthService.refreshAccessToken.mockResolvedValue(mockRefreshResponse);

      const result = await controller.refreshAccessToken(mockRequest);

      expect(service.refreshAccessToken).toHaveBeenCalledWith('refresh_token');
      expect(result).toEqual(mockRefreshResponse.auth);
    });

    it('should throw an Exception if token is not defined', async () => {
      const mockRequestWithoutToken = { cookies: {} };
      await expect(
        controller.refreshAccessToken(mockRequestWithoutToken),
      ).rejects.toEqual(new UnauthorizedException('No refresh token found'));
    });
  });
});
