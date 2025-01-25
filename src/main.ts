import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { BadRequestException, RequestMethod, ValidationPipe } from '@nestjs/common';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';
import { GlobalFileInterceptor } from './common/utils/global-file.interceptor';
import { join } from 'path';
import hbs from 'hbs';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import passport from 'passport';
import { ProjectConfig } from 'firebase-admin/lib/auth/project-config';
import './hbs-helpers';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: (errors) => {
      const errorMessages = errors.map(err => `${Object.values(err.constraints).join(', ')}`);
      return new BadRequestException({
        message: errorMessages.join('; '),
        statusCode: 400,
      });
    }
  }));

  app.useStaticAssets(path.join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  app.useGlobalFilters(new HttpExceptionFilter());


  app.setGlobalPrefix('api/v1', {
    exclude: [{ path: 'dashboard(.*)', method: RequestMethod.ALL }],
  });

  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(bodyParser.json());

  app.useStaticAssets(join(__dirname, '..', 'public'));

  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  app.setViewEngine('hbs');

  hbs.registerPartials(join(__dirname, '..', 'views', 'partials'))

  app.enableCors();

  const PgStore = connectPgSimple(session);

  app.use(
    session({
      name: "admin",
      store: new PgStore({
        conString: `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET,
      resave: false,
      rolling: true,
      saveUninitialized: false,
      cookie: { secure: false, maxAge: 1000 * 60 * 60 }, 
    }),
  );

  app.use('/admin', passport.initialize());
  app.use('/admin', passport.session());
  

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
