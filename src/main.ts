import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import * as passport from 'passport';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

//this is starting function to call.
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      name:"nearShop_sessions",
      secret: process.env.SECRET_KEY,
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 60000,
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
  // app.useGlobalFilters(new HttpExceptionFilter)
  app.useGlobalPipes(new ValidationPipe);
  await app.listen(process.env.ENV_PORT);
}
bootstrap();
