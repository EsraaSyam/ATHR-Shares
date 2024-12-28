import { Injectable, UseFilters } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/user.service';
import { MailerService } from 'src/mailer/mailer.service';
import * as bycrpt from 'bcrypt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UserEntity } from 'src/users/user.entity';
import { RegisterRequest } from './requests/register.request';
import { User } from './responses/user.response';
import { RedisService } from 'src/config/redis.service';
import { UserAlreadyExist } from 'src/exceptions/user-already-exist.exception';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly mailerService: MailerService,
        private readonly jwtService: JwtService,
        private readonly redisService: RedisService,
    ) { }

    async validateUser(phone_number: string, password: string) {
        const user = await this.usersService.findByPhoneNumber(phone_number);
        
        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (user && isPasswordValid) {
            return new User(user);
        }

        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id };

        return this.jwtService.sign(payload);
    }

    async registerUser(registerRequest: RegisterRequest) {
        const email = registerRequest.email;

        const user = await this.usersService.findByEmail(email);

        if (user) {
            throw new UserAlreadyExist('User already exist');
        }

        return await this.usersService.create(registerRequest);
    }

    private generateResetCode() {
        return crypto.randomBytes(3).toString('hex');
    }

    private async saveResetCodeToDatabase(email: string, resetCode: string) {
        const user = await this.usersService.findByEmail(email);

        if (user) {
            user.resetCode = resetCode;
            user.resetCodeExpiration = new Date(Date.now() + 1000 * 60 * 10);
            await this.usersService.updateById(user.id, user);
        }

        return user;
    }

    async sendRestPasswordCode(email: string) {
        const resetCode = this.generateResetCode();
        const user = await this.saveResetCodeToDatabase(email, resetCode);

        if (!user) return false;

        const data = await this.usersService.findByEmail(email);

        await this.mailerService.sendResetPasswordCode(email, resetCode, data.full_name);
        return true;
    }


    async cheakCode(email: string, resetCode: string) {
        const user = await this.usersService.findByEmail(email);

        if(!user || user.resetCode !== resetCode || user.resetCodeExpiration < new Date()) {
            return false;
        }

        return true;
    }

    async resetPassword(email: string, newPassword: string, confirmPassword: string) {
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

    async logout(token: string, redisService: RedisService){
        const decoded = this.jwtService.decode(token);
    
        const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
        
        await redisService.setTokenInBlacklist(token, expiresIn);
        return true;
    }

    async getUserByToken(token: string) {
        if (!token) return null;

        const blacklisted = await this.redisService.isTokenBlacklisted(token);

        const decoded = await this.jwtService.decode(token);

        if (blacklisted) return null;

        const isExpired = decoded.exp < Math.floor(Date.now() / 1000);

        if (isExpired) return null;
        
        const user = await this.usersService.findByEmail(decoded.email);

        return user;
    }
}
