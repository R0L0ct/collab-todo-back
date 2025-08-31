import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { PrismaMockProvider } from '../../test/mocks/prisma-mock';

describe('TodoService', () => {
  let service: TodoService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodoService, PrismaMockProvider],
    }).compile();

    service = module.get<TodoService>(TodoService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
  });

  it('should create a task', async () => {
    (prisma.todo.create as jest.Mock).mockResolvedValue({
      id: 1,
      task: 'new task',
    });
    const result = await service.create({ task: 'new task', userId: 1 });
    expect(result).toEqual({ id: 1, task: 'new task' });
    expect(prisma.todo.create).toHaveBeenCalledWith({
      data: { task: 'new task', userId: 1 },
      include: { user: { select: { username: true } } },
    });
  });

  it('should find many tasks', async () => {
    (prisma.todo.findMany as jest.Mock).mockResolvedValue([
      { id: 1, task: 'task_1' },
      { id: 2, task: 'task_2' },
      { id: 3, task: 'task_3' },
    ]);
    const result = await service.findAll();
    expect(result).toEqual([
      { id: 1, task: 'task_1' },
      { id: 2, task: 'task_2' },
      { id: 3, task: 'task_3' },
    ]);
  });

  it('should find a task', async () => {
    (prisma.todo.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      task: 'task_1',
    });
    const result = await service.findOne(1);
    expect(result).toEqual({ id: 1, task: 'task_1' });
    expect(prisma.todo.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should update a task', async () => {
    (prisma.todo.update as jest.Mock).mockResolvedValue({
      id: 1,
      task: 'updated_task',
    });
    const result = await service.update(1, { task: 'updated_task' });
    expect(result).toEqual({ id: 1, task: 'updated_task' });
    expect(prisma.todo.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { task: 'updated_task' },
    });
  });

  it('should remove a task', async () => {
    (prisma.todo.delete as jest.Mock).mockResolvedValue({
      id: 1,
      task: 'deleted_task',
    });
    const result = await service.remove(1);
    expect(result).toEqual({ id: 1, task: 'deleted_task' });
    expect(prisma.todo.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});
