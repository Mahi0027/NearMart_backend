import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type OtpDocument = Otp & Document;
@Schema()
export class Otp {
  @Prop({ 
    required: true,
  })
  mobile: number;

  @Prop({
    required: true,
  })
  otp: string;

  @Prop({
    required: true,
    min:0,
    max:3
  })
  attempt: number;

  @Prop({
    required: true,
  })
  status: boolean;

  @Prop({
    required: true,
  })
  validity_start: number;

  @Prop({
    required: true,
  })
  validity_end: number;
}
export const OtpSchema = SchemaFactory.createForClass(Otp);