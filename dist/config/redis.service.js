"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const redis_1 = require("redis");
let RedisService = class RedisService {
    async onModuleInit() {
        this.client = (0, redis_1.createClient)({
            socket: {
                host: '127.0.0.1',
                port: 6379,
            },
        });
        await this.client.connect();
        console.log('✅ Redis connected');
    }
    async setTokenInBlacklist(token, expiresIn) {
        await this.client.set(token, 'blacklisted', { EX: expiresIn });
    }
    async isTokenBlacklisted(token) {
        if (!token) {
            throw new Error('التوكن مطلوب');
        }
        const result = await this.client.get(token);
        return result !== null;
    }
    async onModuleDestroy() {
        await this.client.quit();
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = __decorate([
    (0, common_1.Injectable)()
], RedisService);
//# sourceMappingURL=redis.service.js.map