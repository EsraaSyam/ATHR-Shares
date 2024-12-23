import { AuthService } from './auth.service';
import { LoginRequest } from './requests/login.request';
import { RegisterRequest } from './requests/register.request';
import { ForgetPasswordRequest } from './requests/forgetPassword.request';
import { CheakCodeRequest } from './requests/cheakCode.request';
import { ResetPasswordRequest } from './requests/resetPassword.request';
import { RedisService } from 'src/config/redis.service';
import { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    private readonly redisService;
    constructor(authService: AuthService, redisService: RedisService);
    login(loginRequest: LoginRequest, res: any): Promise<any>;
    register(registerRequest: RegisterRequest, res: any): Promise<any>;
    forgotPassword(forgetPasswordRequest: ForgetPasswordRequest, res: any): Promise<any>;
    checkCode(cheakCodeRequest: CheakCodeRequest, res: any): Promise<any>;
    resetPassword(resetPasswordRequest: ResetPasswordRequest, res: any): Promise<any>;
    logout(req: any, res: Response): Promise<Response<any, Record<string, any>>>;
}
