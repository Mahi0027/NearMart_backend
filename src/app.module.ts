import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
// import { JwtService } from '@nestjs/jwt';
import { User, UserSchema } from './schemas/user.schema';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration'
import { OtpsService } from './users/otps/otps.service';
import { Otp, OtpSchema } from 'src/schemas/otp.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: [
        '.dev.env',//its developing environment
        // '.env',
      ],
      ignoreEnvFile: false,
      isGlobal: true,
      cache: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_HOST, {
      autoIndex: true,
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Otp.name, schema: OtpSchema }
    ]),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthService,
    UsersService,
    OtpsService,
    // JwtService
  ],
})
export class AppModule {}
