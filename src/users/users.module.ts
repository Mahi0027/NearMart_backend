import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { Otp, OtpSchema } from 'src/schemas/otp.schema';
import { OtpsService } from './otps/otps.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Otp.name, schema: OtpSchema }
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, OtpsService],
})
export class UsersModule {}
