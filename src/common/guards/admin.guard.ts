import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (!request.session || !request.session.email) {
      console.log('Unauthorized access - Session expired or not found');
      throw new UnauthorizedException('Your session has expired. Please log in again.');
    }
    
    return true;
  }
}
