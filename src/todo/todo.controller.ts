import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createTodoDto: CreateTodoDto): Promise<any> {
    try {
      return this.todoService.create(createTodoDto);
    } catch (error) {
      console.log(error);
    }
  }

  @Get()
  async findAll(): Promise<any> {
    try {
      return this.todoService.findAll();
    } catch (error) {
      console.log(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    try {
      return this.todoService.findOne(+id);
    } catch (error) {
      console.log(error);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<any> {
    try {
      return this.todoService.update(+id, updateTodoDto);
    } catch (error) {
      console.log(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    try {
      return this.todoService.remove(+id);
    } catch (error) {
      console.log(error);
    }
  }
}
