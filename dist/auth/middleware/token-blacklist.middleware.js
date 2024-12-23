"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenBlacklistMiddleware = void 0;
const common_1 = require("@nestjs/common");
const redis_service_1 = require("../../config/redis.service");
let TokenBlacklistMiddleware = class TokenBlacklistMiddleware {
    constructor(redisService) {
        this.redisService = redisService;
    }
    async use(req, res, next) {
        const token = req.headers['authorization'];
        if (!token) {
            throw new common_1.UnauthorizedException('توكن غير موجود');
        }
        const isBlacklisted = await this.redisService.isTokenBlacklisted(token);
        if (isBlacklisted) {
            throw new common_1.UnauthorizedException('التوكن غير صالح، قم بتسجيل الدخول مرة أخرى');
        }
        next();
    }
};
exports.TokenBlacklistMiddleware = TokenBlacklistMiddleware;
exports.TokenBlacklistMiddleware = TokenBlacklistMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService])
], TokenBlacklistMiddleware);
//# sourceMappingURL=token-blacklist.middleware.js.map