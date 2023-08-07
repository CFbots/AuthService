import {
  IsAlphanumeric,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsAlphanumeric()
  @IsNotEmpty()
  @MaxLength(10)
  username: string;
  @IsNotEmpty()
  @MinLength(4)
  password: string;
}
