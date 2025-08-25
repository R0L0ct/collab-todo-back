import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TodoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTodoDto): Promise<any> {
    try {
      const response = await this.prisma.todo.create({ data });
      return response;
    } catch (err) {
      console.log(err);
    }
  }

  async findAll(): Promise<any[]> {
    try {
      const response = await this.prisma.todo.findMany({
        orderBy: { id: 'asc' },
        include: { user: { select: { username: true } } },
      });
      return response;
    } catch (err) {
      console.log(err);
    }
  }

  async findOne(id: number): Promise<any> {
    try {
      const response = await this.prisma.todo.findUnique({ where: { id } });
      return response;
    } catch (err) {
      console.log(err);
    }
  }

  async update(id: number, data: UpdateTodoDto): Promise<any> {
    try {
      const response = await this.prisma.todo.update({ where: { id }, data });
      return response;
    } catch (err) {
      console.log(err);
    }
  }

  async remove(id: number): Promise<any> {
    try {
      const response = await this.prisma.todo.delete({ where: { id } });
      return response;
    } catch (err) {
      console.log(err);
    }
  }
}
