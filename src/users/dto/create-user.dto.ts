import { IsEmail, IsEmpty, IsEnum, IsMobilePhone, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

enum userTypes {
  BUYER='BUYER',
  SELLER='SELLER'
}

enum countryCode { india='IN'};

export class CreateUserDto {
  @IsEnum(countryCode)
  country: string;

  @IsMobilePhone()
  mobile: number;

  @IsEnum(userTypes)
  type: string;
}
