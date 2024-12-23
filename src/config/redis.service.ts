import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;

  async onModuleInit() {
    this.client = createClient({
      socket: {
        host: '127.0.0.1',
        port: 6379,
      },
    });

    await this.client.connect();
    console.log('✅ Redis connected');
  }

  async setTokenInBlacklist(token: string, expiresIn: number) {
    await this.client.set(token, 'blacklisted', { EX: expiresIn });
  }

  async isTokenBlacklisted(token: string) {
    if (!token) {
        throw new Error('التوكن مطلوب');
    }
    const result = await this.client.get(token);
    
    return result !== null;
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}
