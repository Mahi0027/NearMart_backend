import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type UserDocument = User & Document;
enum countryCode { india='IN'};

@Schema()
export class User {
  @Prop()
  first_name: string;
  
  @Prop()
  last_name: string;

  @Prop({
    unique: true,
  })
  email: string;

  @Prop({
    min:15,
    max: 100
  })
  age: number;

  @Prop({
    required: true,
    enum: countryCode,
  })
  country: countryCode;

  @Prop({ 
    required: true,
    unique: true,
  })
  mobile: number;
  
  @Prop()
  type: string;

  @Prop()
  username: string;
  
  @Prop()
  password: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
