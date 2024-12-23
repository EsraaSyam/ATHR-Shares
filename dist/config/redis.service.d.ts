import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
export declare class RedisService implements OnModuleInit, OnModuleDestroy {
    private client;
    onModuleInit(): Promise<void>;
    setTokenInBlacklist(token: string, expiresIn: number): Promise<void>;
    isTokenBlacklisted(token: string): Promise<boolean>;
    onModuleDestroy(): Promise<void>;
}
