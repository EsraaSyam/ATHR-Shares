import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';
import { GlobalFileInterceptor } from './common/utils/global-file.interceptor';

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
  
  app.setGlobalPrefix('api/v1');

  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(bodyParser.json());

  // const reflector = app.get(Reflector);
  // app.useGlobalInterceptors(new GlobalFileInterceptor(reflector));  
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
