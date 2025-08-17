import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  task: string;

  @IsBoolean()
  @IsOptional()
  isCompleted: boolean;

  @IsOptional()
  @IsDate()
  deletedAt?: Date;
}
