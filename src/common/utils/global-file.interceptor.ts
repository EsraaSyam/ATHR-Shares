import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { AnyFilesInterceptor } from '@nestjs/platform-express';
  import { Reflector } from '@nestjs/core';
  
  @Injectable()
  export class GlobalFileInterceptor implements NestInterceptor {
    constructor(private reflector: Reflector) {}
  
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
      const request = context.switchToHttp().getRequest();
  
      const interceptor = new (AnyFilesInterceptor())();
  
      await interceptor.intercept(context, next);
  
      return next.handle();
    }
  }
  