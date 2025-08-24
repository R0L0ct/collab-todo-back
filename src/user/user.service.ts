import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<any> {
    try {
      const response = await this.prisma.user.create({ data });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<any> {
    try {
      const response = await this.prisma.user.findMany();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number): Promise<any> {
    try {
      const response = await this.prisma.user.findUnique({ where: { id } });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async findOneByUsername(username: string): Promise<any> {
    try {
      const response = await this.prisma.user.findUnique({
        where: { username },
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, data: UpdateUserDto): Promise<any> {
    try {
      const response = await this.prisma.user.update({ where: { id }, data });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number): Promise<any> {
    try {
      const response = await this.prisma.user.delete({ where: { id } });
      return response;
    } catch (error) {
      throw error;
    }
  }
}
