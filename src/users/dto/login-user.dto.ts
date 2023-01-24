import { IsEmail, IsEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class loginUserDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}
