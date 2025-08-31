import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { JwtAuthGuard } from '../../src/auth/guards/jwt-auth.guard';

describe('TodoController', () => {
  let controller: TodoController;
  let service: TodoService;

  const mockTodoService = {
    create: jest.fn((data: { task: string }) => ({
      id: 1,
      task: data.task,
      user: { username: 'test' },
    })),
    findOne: jest.fn((id: number) => ({ id, task: 'task' })),
    findAll: jest.fn(() => {
      return [
        { id: 1, task: 'task_1', user: { username: 'test' } },
        { id: 2, task: 'task_2', user: { username: 'test' } },
      ];
    }),
    update: jest.fn((id: number, data: { isCompleted: boolean }) => ({
      id,
      isCompleted: data.isCompleted,
      task: 'task',
    })),
    remove: jest.fn((id: number) => ({ id, task: 'removed_task' })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [{ provide: TodoService, useValue: mockTodoService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: () => true,
      })
      .compile();

    controller = module.get<TodoController>(TodoController);
    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should call service.create function', async () => {
    const result = await controller.create({ task: 'new task', userId: 1 });
    expect(service.create).toHaveBeenCalledWith({
      task: 'new task',
      userId: 1,
    });
    expect(result).toEqual({
      id: 1,
      task: 'new task',
      user: { username: 'test' },
    });
  });

  it('should call service.findOne function', async () => {
    const result = await controller.findOne('1');
    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual({ id: 1, task: 'task' });
  });

  it('should call service.findAll function', async () => {
    const result = await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual([
      { id: 1, task: 'task_1', user: { username: 'test' } },
      { id: 2, task: 'task_2', user: { username: 'test' } },
    ]);
  });

  it('should call service.update function', async () => {
    const result = await controller.update('1', { isCompleted: true });
    expect(service.update).toHaveBeenCalledWith(1, { isCompleted: true });
    expect(result).toEqual({ id: 1, isCompleted: true, task: 'task' });
  });

  it('should call service.remove function', async () => {
    const result = await controller.remove('1');
    expect(service.remove).toHaveBeenCalledWith(1);
    expect(result).toEqual({ id: 1, task: 'removed_task' });
  });
});
