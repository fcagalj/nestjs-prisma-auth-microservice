import { IsNotEmpty } from 'class-validator';
export class LoginUserDto {
  @IsNotEmpty()
  readonly login: string;

  @IsNotEmpty()
  readonly password: string;
}
export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  login: string;

  @IsNotEmpty()
  password: string;
}
export class UpdatePasswordDto {
  @IsNotEmpty()
  new_password: string;

  @IsNotEmpty()
  old_password: string;
}
