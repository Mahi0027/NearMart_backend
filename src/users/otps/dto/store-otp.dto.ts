import { IsMobilePhone, IsString } from "class-validator";

export class StoreOtpDto {
  @IsMobilePhone()
  mobile: number;

  @IsString()
  otp: string;
}