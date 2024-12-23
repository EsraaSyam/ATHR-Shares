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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../users/user.service");
const mailer_service_1 = require("../mailer/mailer.service");
const bycrpt = require("bcrypt");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const user_response_1 = require("./responses/user.response");
const redis_service_1 = require("../config/redis.service");
const user_already_exist_exception_1 = require("../exceptions/user-already-exist.exception");
let AuthService = class AuthService {
    constructor(usersService, mailerService, jwtService, redisService) {
        this.usersService = usersService;
        this.mailerService = mailerService;
        this.jwtService = jwtService;
        this.redisService = redisService;
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (!user)
            return null;
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (user && isPasswordValid) {
            return new user_response_1.User(user);
        }
        return null;
    }
    async login(user) {
        const payload = { email: user.email, sub: user.id };
        return this.jwtService.sign(payload);
    }
    async registerUser(registerRequest) {
        const email = registerRequest.email;
        const user = await this.usersService.findByEmail(email);
        if (user) {
            throw new user_already_exist_exception_1.UserAlreadyExist('User already exist');
        }
        return await this.usersService.create(registerRequest);
    }
    generateResetCode() {
        return crypto.randomBytes(3).toString('hex');
    }
    async saveResetCodeToDatabase(email, resetCode) {
        const user = await this.usersService.findByEmail(email);
        if (user) {
            user.resetCode = resetCode;
            user.resetCodeExpiration = new Date(Date.now() + 1000 * 60 * 10);
            await this.usersService.updateById(user.id, user);
        }
        return user;
    }
    async sendRestPasswordCode(email) {
        const resetCode = this.generateResetCode();
        const user = await this.saveResetCodeToDatabase(email, resetCode);
        if (!user)
            return false;
        await this.mailerService.sendResetPasswordCode(email, resetCode);
        return true;
    }
    async cheakCode(email, resetCode) {
        const user = await this.usersService.findByEmail(email);
        if (!user || user.resetCode !== resetCode || user.resetCodeExpiration < new Date()) {
            return false;
        }
        return true;
    }
    async resetPassword(email, newPassword, confirmPassword) {
        const user = await this.usersService.findByEmail(email);
        if (!user || newPassword !== confirmPassword) {
            return false;
        }
        const hashedPassword = await bycrpt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetCode = null;
        user.resetCodeExpiration = null;
        await this.usersService.updateById(user.id, user);
        return true;
    }
    async logout(token, redisService) {
        const decoded = this.jwtService.decode(token);
        const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
        await redisService.setTokenInBlacklist(token, expiresIn);
        return true;
    }
    async getUserByToken(token) {
        if (!token)
            return null;
        const blacklisted = await this.redisService.isTokenBlacklisted(token);
        const decoded = await this.jwtService.decode(token);
        if (blacklisted)
            return null;
        const isExpired = decoded.exp < Math.floor(Date.now() / 1000);
        if (isExpired)
            return null;
        const user = await this.usersService.findByEmail(decoded.email);
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UsersService,
        mailer_service_1.MailerService,
        jwt_1.JwtService,
        redis_service_1.RedisService])
], AuthService);
//# sourceMappingURL=auth.service.js.map