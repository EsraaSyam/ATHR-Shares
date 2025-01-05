import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private jwtService: JwtService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const token = req.headers['authorization'];

        if (!token) {
            req['user'] = { role: 'guest' };
            return next();
        }

        try {
            const decoded = this.jwtService.verify(token);
            req['user'] = decoded; 
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }

        next();
    }
}
