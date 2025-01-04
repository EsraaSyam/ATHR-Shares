import { Injectable, UnauthorizedException, UseFilters } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/user.service';
import { MailerService } from 'src/mailer/mailer.service';
import * as bycrpt from 'bcrypt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UserEntity } from 'src/users/user.entity';
import { RegisterRequest } from './requests/register.request';
import { User } from './responses/user.response';
import { UserAlreadyExist } from 'src/exceptions/user-already-exist.exception';
import { Role } from 'src/users/user.enum';
import * as admin from 'firebase-admin';
import { TokenEntity } from './token.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly mailerService: MailerService,
        private readonly jwtService: JwtService,
        @InjectRepository(TokenEntity)
        private tokenRepository: Repository<TokenEntity>,
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
        const payload = { email: user.email, sub: user.id, role: user.role };

        const accessToken = this.jwtService.sign(payload);

        const token = new TokenEntity();

        token.accessToken = accessToken;

        token.user = user; 

        await this.tokenRepository.save(token);

        return accessToken;
    }

    async registerUser(registerRequest: RegisterRequest) {
        const email = registerRequest.email;


        const user = await this.usersService.findByEmail(email);

        if (user) {
            throw new UserAlreadyExist('User already exist');
        }

        const newUser = await this.usersService.create(registerRequest);

        const payload = { email: newUser.email, sub: newUser.id, role: newUser.role };
        const token = this.jwtService.sign(payload);

        const tokenEntity = new TokenEntity();
        tokenEntity.accessToken = token;
        tokenEntity.user = newUser;
        await this.tokenRepository.save(tokenEntity);

        return {
            token,
            user: newUser,
        };
    }


    async generateFackData() {
        const user = new UserEntity();
        user.full_name = `Guest_${Date.now()}`;
        user.email = `${user.full_name.toLowerCase()}@example.com`;
        user.password = await bycrpt.hash('123456', 10);
        user.phone_number = `${Math.floor(1000000000 + Math.random() * 9000000000)}`;
        user.role = Role.GUEST;

        const new_Guest = await this.usersService.create(user);

        const token = this.jwtService.sign({ email: user.email, sub: user.id, role: user.role });
        const tokenEntity = new TokenEntity();

        tokenEntity.accessToken = token;
        tokenEntity.user = new_Guest;
        await this.tokenRepository.save(tokenEntity);
        return {
            token,
            user: new_Guest,
        };
    }



    private generateResetCode() {
        return crypto.randomBytes(3).toString('hex');
    }

    private async saveResetCodeToDatabase(email: string, resetCode: string) {
        const user = await this.usersService.findByEmail(email);

        if (user) {
            user.resetCode = resetCode;
            user.resetCodeExpiration = new Date(Date.now() + 1000 * 60 * 10);
            await this.usersService.updateById(Number(user.id), user);
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

        if (!user || user.resetCode !== resetCode || user.resetCodeExpiration < new Date()) {
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

        await this.usersService.updateById(Number(user.id), user);
        return true;
    }

    async logout(id: string) {
        await this.tokenRepository.delete({ user: { id: id } });
        return { message: 'Logged out successfully' };
    }

    async getUserByToken(token: string) {
        if (!token) {
            throw new UnauthorizedException('Token not provided');
        }
    
        try {
            const decoded: any = await this.jwtService.verifyAsync(token);
    
            if (!decoded || !decoded.email) {
                throw new UnauthorizedException('Invalid token');
            }
    
            const user = await this.usersService.findByEmail(decoded.email);
    
            if (!user) {
                throw new UnauthorizedException('User not found');
            }
    
            if (!user.tokens || user.tokens.length === 0) {
                throw new UnauthorizedException('Your session has expired');
            }
    
            return user;
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
    

    async findByPhoneNumber(phone_number: string) {
        return this.usersService.findByPhoneNumber(phone_number);
    }

    async checkIfUserExists(uid: string) {
        const user = await admin.auth().getUser(uid);

        if(!user) {
            throw new UnauthorizedException('User does not exist');
        }

        const phone_number = user.phoneNumber;
        const userExist = await this.usersService.findByPhoneNumber(phone_number);

        if(!userExist) {
            throw new UnauthorizedException('User does not exist');
        }

        userExist.is_verified = true;

        await this.usersService.updateById(Number(userExist.id), userExist);

        return user;
    }
}
