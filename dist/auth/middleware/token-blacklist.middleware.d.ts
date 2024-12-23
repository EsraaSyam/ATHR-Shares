import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RedisService } from 'src/config/redis.service';
export declare class TokenBlacklistMiddleware implements NestMiddleware {
    private readonly redisService;
    constructor(redisService: RedisService);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
