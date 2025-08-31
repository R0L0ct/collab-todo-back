import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../../src/user/user.service';
import { PrismaMockProvider } from '../../test/mocks/prisma-mock';
import { PrismaService } from '../../src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret',
        }),
      ],
      providers: [AuthService, UserService, PrismaMockProvider],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
