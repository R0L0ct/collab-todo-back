import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    create: jest.fn((data: { username: string; password: string }) => ({
      id: 1,
      username: data.username,
    })),
    findOne: jest.fn((id: number) => ({ id, username: 'test' })),
    findAll: jest.fn(() => {
      return [
        { id: 1, username: 'test_1' },
        { id: 2, username: 'test_2' },
      ];
    }),
    update: jest.fn((id: number, data: { username: string }) => ({
      id,
      username: data.username,
    })),
    remove: jest.fn((id: number) => ({ id, username: 'removed_test' })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
