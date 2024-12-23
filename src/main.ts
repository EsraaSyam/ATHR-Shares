import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

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
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
