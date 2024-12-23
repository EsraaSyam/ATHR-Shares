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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const login_request_1 = require("./requests/login.request");
const register_request_1 = require("./requests/register.request");
const user_response_1 = require("./responses/user.response");
const http_exception_filter_1 = require("../common/filters/http-exception.filter");
const forgetPassword_request_1 = require("./requests/forgetPassword.request");
const cheakCode_request_1 = require("./requests/cheakCode.request");
const resetPassword_request_1 = require("./requests/resetPassword.request");
const redis_service_1 = require("../config/redis.service");
let AuthController = class AuthController {
    constructor(authService, redisService) {
        this.authService = authService;
        this.redisService = redisService;
    }
    async login(loginRequest, res) {
        const user = await this.authService.validateUser(loginRequest.email, loginRequest.password);
        if (!user) {
            return res.status(401).json({
                message: 'يوجد خظأ في الايميل او الباسورد',
            });
        }
        const token = await this.authService.login(user);
        return res.status(200).json({
            message: 'تم تسجيل الدخول بنجاح',
            data: {
                token: token,
                user: user,
            }
        });
    }
    async register(registerRequest, res) {
        const user = await this.authService.registerUser(registerRequest);
        if (!user) {
            return res.status(400).json({
                message: 'خطأ في تسجيل المستخدم',
            });
        }
        return res.status(201).json({
            message: 'تم تسجيل المستخدم بنجاح',
            data: new user_response_1.User(user),
        });
    }
    async forgotPassword(forgetPasswordRequest, res) {
        const done = await this.authService.sendRestPasswordCode(forgetPasswordRequest.email);
        if (!done) {
            return res.status(400).json({
                message: 'لا يوجد مستخدم بهذا الايميل',
            });
        }
        return res.status(200).json({
            message: 'تم ارسال رمز التحقق الي البريد الالكتروني',
        });
    }
    async checkCode(cheakCodeRequest, res) {
        const done = await this.authService.cheakCode(cheakCodeRequest.email, cheakCodeRequest.resetCode);
        if (!done) {
            return res.status(400).json({
                message: 'خطأ في رمز التحقق',
            });
        }
        return res.status(200).json({
            message: 'تم التحقق من رمز التحقق بنجاح',
        });
    }
    async resetPassword(resetPasswordRequest, res) {
        const done = await this.authService.resetPassword(resetPasswordRequest.email, resetPasswordRequest.newPassword, resetPasswordRequest.confirmPassword);
        if (!done) {
            return res.status(400).json({
                message: 'خطأ في اعادة تعيين كلمة السر',
            });
        }
        return res.status(200).json({
            message: 'تم تغيير كلمة السر بنجاح',
        });
    }
    async logout(req, res) {
        const token = req.headers['authorization'];
        if (!token) {
            throw new common_1.UnauthorizedException('توكن غير موجود');
        }
        const done = await this.authService.logout(token, this.redisService);
        if (!done) {
            throw new common_1.UnauthorizedException('خطأ في تسجيل الخروج');
        }
        return res.status(200).json({ message: 'تم تسجيل الخروج بنجاح' });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_request_1.LoginRequest, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('/register'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_request_1.RegisterRequest, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('/forgot-password'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgetPassword_request_1.ForgetPasswordRequest, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('/check-code'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cheakCode_request_1.CheakCodeRequest, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "checkCode", null);
__decorate([
    (0, common_1.Post)('/reset-password'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [resetPassword_request_1.ResetPasswordRequest, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('/logout'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    (0, common_1.UseFilters)(new http_exception_filter_1.HttpExceptionFilter()),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        redis_service_1.RedisService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map