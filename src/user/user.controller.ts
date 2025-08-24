import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<any> {
    try {
      return await this.userService.create(createUserDto);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(): Promise<any> {
    try {
      return await this.userService.findAll();
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    try {
      return await this.userService.findOne(+id);
    } catch (error) {
      throw error;
    }
  }

  @Post()
  async findOneByUsername(@Body() username: string): Promise<any> {
    try {
      return await this.userService.findOneByUsername(username);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<any> {
    try {
      return await this.userService.update(+id, updateUserDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    try {
      return await this.userService.remove(+id);
    } catch (error) {
      throw error;
    }
  }
}
