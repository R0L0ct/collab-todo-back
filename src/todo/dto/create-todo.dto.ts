import {
  IsBoolean,
  IsDate,
  IsInt,
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
  isCompleted?: boolean;

  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsOptional()
  @IsDate()
  deletedAt?: Date;
}
