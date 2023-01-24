import { IsEmail, IsEmpty, IsEnum, IsMobilePhone, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator";
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

enum userTypes {
  BUYER='BUYER',
  SELLER='SELLER'
}

enum countryCode { india='IN'};

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  first_name: string;

  @IsOptional()
  @IsString()
  last_name: string;

  @IsOptional()
  @IsNumber()
  @Min(15)
  @Max(100)
  age: number;

  @IsOptional()
  @IsEmail()
  email: string;
  
  //come from background
  @IsEnum(countryCode)
  country: string;

  //come from background
  @IsMobilePhone()
  mobile: number;

  //come from background
  @IsEnum(userTypes)
  type: string;

  // @IsOptional()
  // @IsString()
  // username: string;

  // @IsOptional()
  // @IsString()
  // @MinLength(8)
  // @MaxLength(20)
  // password: string;
}
