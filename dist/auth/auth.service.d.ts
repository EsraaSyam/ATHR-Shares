import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/user.service';
import { MailerService } from 'src/mailer/mailer.service';
import { UserEntity } from 'src/users/user.entity';
import { RegisterRequest } from './requests/register.request';
import { User } from './responses/user.response';
import { RedisService } from 'src/config/redis.service';
export declare class AuthService {
    private readonly usersService;
    private readonly mailerService;
    private readonly jwtService;
    private readonly redisService;
    constructor(usersService: UsersService, mailerService: MailerService, jwtService: JwtService, redisService: RedisService);
    validateUser(email: string, password: string): Promise<User>;
    login(user: any): Promise<string>;
    registerUser(registerRequest: RegisterRequest): Promise<import("../users/requests/create-user.requests").CreateUserRequest & UserEntity>;
    private generateResetCode;
    private saveResetCodeToDatabase;
    sendRestPasswordCode(email: string): Promise<boolean>;
    cheakCode(email: string, resetCode: string): Promise<boolean>;
    resetPassword(email: string, newPassword: string, confirmPassword: string): Promise<boolean>;
    logout(token: string, redisService: RedisService): Promise<boolean>;
    getUserByToken(token: string): Promise<UserEntity>;
}
