import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  MinLength,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  name: string;

  @IsNumber()
  @IsNotEmpty()
  salary?: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  currency: string;

  @IsString()
  @IsNotEmpty()
  department: string;

  @IsString()
  @IsNotEmpty()
  subDepartment: string;

  @IsBoolean()
  @IsOptional()
  onContract?: boolean;
}
