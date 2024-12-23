import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import { RedisService } from 'src/config/redis.service';

@Injectable()
export class TokenBlacklistMiddleware implements NestMiddleware {
  constructor(private readonly redisService: RedisService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization'];

    if (!token) {
      throw new UnauthorizedException('توكن غير موجود');
    }

    const isBlacklisted = await this.redisService.isTokenBlacklisted(token);

    if (isBlacklisted) {
      throw new UnauthorizedException('التوكن غير صالح، قم بتسجيل الدخول مرة أخرى');
    }

    next();
  }
}
