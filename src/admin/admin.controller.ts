import { Body, Controller, Delete, Get, Param, Post, Put, Query, Render, Req, Res, Session, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/user.service';
import { Response } from 'express';
import { AnyFilesInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { identity } from 'rxjs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AdminUpdateUserRequest } from './requests/update-user.request';
import { LoginAdminRequest } from './requests/login-admin.request';
import { loginAdminResponse } from './response/login-admin.response';
import { RegisterAdminRequest } from './requests/register-admin-request';
import { isValidId } from 'src/validators/is-valid-id.decorator';
import { UpdatePaymentRequest } from './requests/update-payment.request';
import { SessionAuthGuard } from 'src/common/guards/admin.guard';

@Controller('admin')
@UseGuards(SessionAuthGuard)
export class AdminController {
    constructor(
        private readonly adminService: AdminService,
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) { }

    @Get('/login')
    async getAuthSession(@Session() sessionId: Record <string, any>) {
        console.log(sessionId);

    }

    @Post('/register')
    @UseInterceptors(
        FilesInterceptor('profile_image', 1, {
            storage: diskStorage({
                destination: './uploads/profile_images',
                filename: (req, file, callback) => {
                    const uniqueName = `${Date.now()}${extname(file.originalname)}`;
                    callback(null, uniqueName);
                },
            }),
        }),
    )
    async register(@Body() registerAdminRequest: RegisterAdminRequest, @UploadedFiles() file: Express.Multer.File[], @Res() res) {
        if (!file || file.length === 0) {
            registerAdminRequest.profile_image = `${process.env.LOCAL_URL}/uploads/defualt_images/ATHR.jpg`;
        } else {
            registerAdminRequest.profile_image = `${process.env.LOCAL_URL}/uploads/profile_images/${file[0].filename}`;
        }

        const admin = await this.adminService.createAdmin(registerAdminRequest);

        if (!admin) {
            return res.status(400).json(
                {
                    message: 'خطأ في تسجيل المستخدم',
                }
            );
        }

        return res.status(201).json(
            {
                message: 'تم تسجيل المستخدم بنجاح',
                data: admin,
            }
        );
    }

    @Get('/users')
    async getUsers(@Res() res: Response, @Query('page') page: number, @Query('limit') limit: number) {
        const users = await this.adminService.getUsers(page, limit);

        return res.status(200).json(
            {
                message: 'تم جلب البيانات بنجاح',
                data: users,
            }
        );
    }

    @Get('/users/:id')
    async getUser(@isValidId() @Param('id') id: string, @Res() res: Response) {
        const user = await this.adminService.findUserById(parseInt(id));

        if (!user) {
            return res.status(404).json(
                {
                    message: 'المستخدم غير موجود',
                }
            );
        }

        return res.status(200).json(
            {
                message: 'تم جلب البيانات بنجاح',
                data: user,
            }
        );
    }

    @Delete('/users/:id')
    async deleteUser(@isValidId() @Param('id') id: string, @Res() res: Response) {
        try {
            await this.adminService.deleteUser(parseInt(id));

            return res.status(200).json(
                {
                    message: 'تم حذف المستخدم بنجاح',
                }
            );
        } catch (error) {
            return res.status(400).json(
                {
                    message: 'حدث خطأ اثناء حذف المستخدم',
                }
            );
        }
    }


    @Put('/users/:id')
    @UseInterceptors(AnyFilesInterceptor())
    async updateUser(@isValidId() @Param('id') id: string, @Body() updateUserRequest: AdminUpdateUserRequest, @Res() res: Response) {
        try {
            const updatedUser = await this.adminService.updateUser(parseInt(id), updateUserRequest);

            return res.status(200).json(
                {
                    message: 'تم تحديث بيانات المستخدم بنجاح',
                    data: updatedUser,
                });

        } catch (error) {
            return res.status(400).json(
                {
                    message: 'حدث خطأ اثناء تحديث بيانات المستخدم',
                    error: error.message,
                }
            );
        }

    }

    @Get('/payments')
    async getPayments(@Res() res: Response, @Query('page') page: number, @Query('limit') limit: number) {
        const payments = await this.adminService.getPayments(page, limit);

        if (payments) {
            return res.status(200).json(
                {
                    message: 'تم جلب البيانات بنجاح',
                    data: payments,
                }
            );
        }
    }

    @Get('/payments/:id')
    async getPayment(@isValidId() @Param('id') id: string, @Res() res: Response) {
        const payment = await this.adminService.getPaymentById(parseInt(id));

        if (payment) {
            return res.status(200).json(
                {
                    message: 'تم جلب البيانات بنجاح',
                    data: payment,
                }
            );
        }
    }


    @Delete('/payment/:id')
    async deletePayment(@isValidId() @Param('id') id: string, @Res() res: Response) {
        try {
            await this.adminService.deletePayment(parseInt(id));

            return res.status(200).json(
                {
                    message: 'تم حذف التحويل بنجاح',
                }
            );
        } catch (error) {
            return res.status(400).json(
                {
                    message: "حدث خطأ في الحذف",
                }
            );
        }
    }

    @Put('/payment/:id')
    async updatePayment(@isValidId() @Param('id') id: string, @Body() updatePaymentRequest: UpdatePaymentRequest, @Res() res: Response) {
        try {
            await this.adminService.updatePayment(parseInt(id), updatePaymentRequest);

            return res.status(200).json(
                {
                    message: 'تم تحديث البيانات بنجاح',
                }
            );
        } catch (error) {
            return res.status(400).json(
                {
                    message: 'حدث خطأ اثناء تحديث البيانات',
                }
            );
        }
    }

    @Get('/realty')
    async getAllRealtys(@Res() res: Response, @Query('page') page: number, @Query('limit') limit: number) {
        const realtys = await this.adminService.getRealtys(page, limit);
        return res.status(200).json(
            {
                message: 'تم جلب البيانات بنجاح',
                data: realtys,
            }
        );
    }

}