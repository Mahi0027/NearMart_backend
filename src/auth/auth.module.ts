import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
// import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { SessionSerializer } from './session.serializer';
import { Otp, OtpSchema } from 'src/schemas/otp.schema';
import { OtpsService } from 'src/users/otps/otps.service';
// import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Otp.name, schema: OtpSchema },
    ]),
    UsersModule,
    // PassportModule,
    PassportModule.register({ session: true })// only for session authentication.
  ],
  providers: [
    AuthService,
    UsersService,
    LocalStrategy,
    SessionSerializer,
    OtpsService,
  ],
  exports: [
    AuthService
  ]
})
export class AuthModule {}
