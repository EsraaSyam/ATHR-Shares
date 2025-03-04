import { BadRequestException, Body, Controller, Post, Req, Res, UnauthorizedException, UploadedFiles, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequest } from './requests/login.request';
import { RegisterRequest } from './requests/register.request';
import { User } from './responses/user.response';
import * as crypto from 'crypto';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { ForgetPasswordRequest } from './requests/forgetPassword.request';
import { CheakCodeRequest } from './requests/cheakCode.request';
import { ResetPasswordRequest } from './requests/resetPassword.request';
import { Response } from 'express';
import { AnyFilesInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/users/enums/user.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsersService } from 'src/users/user.service';
import { ReconnectStrategyError } from 'redis';
import { AdminService } from 'src/admin/admin.service';
import { LoginAdminRequest } from 'src/admin/requests/login-admin.request';
import { loginAdminResponse } from 'src/admin/response/login-admin.response';

@Controller('auth')
@UseGuards(RolesGuard)
@UseFilters(new HttpExceptionFilter())
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService,
        // private readonly adminService: AdminService,
    ) { }

    @Post('/admin/login')
    async loginAdmin(@Body() loginAdminRequest: LoginAdminRequest, @Req() req, @Res() res: Response) {
        const admin = await this.authService.validateAdmin(loginAdminRequest.email, loginAdminRequest.password);

        if (!admin) {
            return res.status(401).json(
                {
                    message: 'يوجد خظأ في البريد الالكتروني او الباسورد',
                }
            );
        }

        if (!req.session) {
            return res.status(500).json({ message: 'حدث خطأ في إنشاء الجلسة. يرجى المحاولة لاحقًا' });
        }

        const { email } = loginAdminRequest;

        req.session.email = email;

        return res.status(200).json(
            {
                message: 'تم تسجيل الدخول بنجاح',
                data: new loginAdminResponse(admin),
                session: req.session,
            }
        );
    }

    @Post('/admin/logout')
    async logoutAdmin(@Req() req, @Res() res: Response) {
        req.session.destroy(err => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ message: 'Failed to log out' });
            }

            res.clearCookie('connect.sid');
            return res.status(200).json({ message: "Successfully logged"});
        });
    }

    @Post('login')
    @UseInterceptors(AnyFilesInterceptor())
    async login(@Body() loginRequest: LoginRequest, @Res() res) {
        const user = await this.authService.validateUser(loginRequest.phone_number, loginRequest.password);

        if (!user) {
            return res.status(401).json(
                {
                    message: 'يوجد خظأ في رقم الموبايل او الباسورد',
                }
            );
        }

        const token = await this.authService.login(user);

        return res.status(200).json(
            {
                message: 'تم تسجيل الدخول بنجاح',
                data: {
                    token: token,
                    user: new User(user),
                }
            }
        );
    }


    @Post('/register')
    @UseInterceptors(
        FilesInterceptor('profile_photo', 1, {
            storage: diskStorage({
                destination: './uploads/profile_images',
                filename: (req, file, callback) => {
                    const uniqueName = `${Date.now()}${extname(file.originalname)}`;
                    callback(null, uniqueName);
                },
            }),
        }),
    )
    async register(@Body() registerRequest: RegisterRequest, @UploadedFiles() file: Express.Multer.File[], @Res() res) {
        if (!file || file.length === 0) {
            registerRequest.profile_photo = `${process.env.LOCAL_URL}/uploads/defualt_images/ATHR.jpg`;
        } else {
            registerRequest.profile_photo = `${process.env.LOCAL_URL}/uploads/profile_images/${file[0].filename}`;
        }
        const user = await this.authService.registerUser(registerRequest);

        if (!user) {
            return res.status(400).json(
                {
                    message: 'خطأ في تسجيل المستخدم',
                }
            );
        }

        return res.status(201).json(
            {
                message: 'تم تسجيل المستخدم بنجاح',
                data: user,
            }
        );
    }

    @Post('/register-guest')
    @UseInterceptors(AnyFilesInterceptor())
    async registerGuest(@Res() res: Response) {
        const user = await this.authService.generateFackData();

        if (!user) {
            return res.status(400).json(
                {
                    message: 'خطأ في تسجيل المستخدم',
                }
            );
        }

        return res.status(201).json(
            {
                message: 'تم تسجيل المستخدم بنجاح',
                data: user
            }
        );
    }

    @Post('/forgot-password')
    @Roles(Role.USER)
    @UseInterceptors(AnyFilesInterceptor())
    async forgotPassword(@Body() forgetPasswordRequest: ForgetPasswordRequest, @Req() req, @Res() res) {
        const user = req.user;
        const done = await this.authService.sendRestPasswordCode(forgetPasswordRequest.email);

        if (!done) {
            return res.status(400).json(
                {
                    message: 'لا يوجد مستخدم بهذا الايميل',
                }
            );
        }

        return res.status(200).json(
            {
                message: 'تم ارسال رمز التحقق الي البريد الالكتروني',
            }
        );
    }

    @Post('/check-code')
    @UseInterceptors(AnyFilesInterceptor())
    async checkCode(@Body() cheakCodeRequest: CheakCodeRequest, @Res() res) {
        const done = await this.authService.cheakCode(cheakCodeRequest.email, cheakCodeRequest.resetCode);

        if (!done) {
            return res.status(400).json(
                {
                    message: 'خطأ في رمز التحقق',
                }
            );
        }

        return res.status(200).json(
            {
                message: 'تم التحقق من رمز التحقق بنجاح',
            }
        );
    }

    @Post('/reset-password')
    @Roles(Role.USER)
    @UseInterceptors(AnyFilesInterceptor())
    async resetPassword(@Body() resetPasswordRequest: ResetPasswordRequest, @Req() req, @Res() res) {
        const done = await this.authService.resetPassword(resetPasswordRequest.email, resetPasswordRequest.newPassword, resetPasswordRequest.confirmPassword);

        if (!done) {
            return res.status(400).json(
                {
                    message: 'خطأ في اعادة تعيين كلمة السر',
                }
            );
        }

        return res.status(200).json(
            {
                message: 'تم تغيير كلمة السر بنجاح',
            }
        );
    }

    @Post('/logout')
    async logout(@Req() req, @Res() res: Response) {
        const token = req.headers['authorization'];

        if (!token) {
            throw new UnauthorizedException('توكن غير موجود');
        }

        const user = await this.authService.getUserByToken(token);

        const done = await this.authService.logout(user.id);

        if (!done) {
            throw new UnauthorizedException('خطأ في تسجيل الخروج');
        }

        return res.status(200).json({ message: 'تم تسجيل الخروج بنجاح' });
    }



    @Post('/verify-phone-number')
    @UseInterceptors(AnyFilesInterceptor())
    async verifyPhoneNumber(@Body('uid') uid: string, @Res() res: Response) {
        try {
            const user = await this.authService.checkIfUserExists(uid);

            return res.status(200).json({
                message: 'تم التحقق من رقم الهاتف بنجاح',
                data: user,
            });
        } catch (error) {
            return res.status(400).json({
                message: error.message || 'حدث خطأ أثناء التحقق من رقم الهاتف',
            });
        }
    }

    @Post('update-fcm-token')
    @UseInterceptors(AnyFilesInterceptor())
    async updateFcmToken(@Body() body: { fcmToken: string }, @Req() req, @Res() res: Response) {
        const token = req.headers['authorization'];

        if (!token) {
            throw new UnauthorizedException('توكن غير موجود');
        }

        const user = await this.authService.getUserByToken(token);

        await this.authService.updateFcmToken(user.id, body.fcmToken);

        return res.status(200).json({ message: 'تم تحديث التوكن بنجاح' });
    }

    @Post('send')
    async sendNotification(@Body() body: { title: string; message: string }, @Req() req, @Res() res: Response) {
        const token = req.headers['authorization'];

        if (!token) {
            throw new UnauthorizedException('توكن غير موجود');
        }

        if (!body.title || !body.message) {
            throw new BadRequestException('الرجاء ادخال العنوان والرسالة');
        }

        const user = await this.authService.getUserByToken(token);


        const { title, message } = body;

        if (!user || !user.fcm_token) {
            throw new UnauthorizedException('لا يوجد مستخدم');
        }

        return this.authService.sendNotification(user.fcm_token, title, message);
    }

}




