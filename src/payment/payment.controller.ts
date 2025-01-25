import { Body, Controller, Get, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PriceDetailsEntity } from './entities/price-details.entity';
import { Response } from 'express';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { CreatePaymentRequest } from './requests/create-payment.request';
import { GetPaymentDetailsRequest } from './requests/get-payment-detils.request';
import { AuthService } from 'src/auth/auth.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/users/user.enum';
import { extname } from 'path';
import { diskStorage } from 'multer';

@UseGuards(RolesGuard)
@Controller('payment')
export class PaymentController {
    constructor(
        private readonly paymentService: PaymentService,
        private readonly authService: AuthService,

    ) { }

    @Get('price-details')
    @Roles(Role.GUEST, Role.USER)
    @UseInterceptors(AnyFilesInterceptor())
    async getPriceDetails(@Body() getPaymrntDetailsRequest: GetPaymentDetailsRequest, @Req() req, @Res() res: Response) {
        const user = req.user;
        try {
            const paymentDetails = await this.paymentService.getPriceDetails(getPaymrntDetailsRequest);
            return res.status(200).json({
                message: 'تمت بنجاح',
                data: paymentDetails,
            });
        } catch (error) {
            return res.status(400).json({
                message: 'حدث خطأ ما',
                error: error.message,
            });
        }
    }

    @Post('create-payment')
    @Roles(Role.USER)
    @UseInterceptors(FileInterceptor('payment_image', {
        storage: diskStorage({
            destination: './uploads/payment_images',
            filename: (req, file, callback) => {
                const uniqueName = `${Date.now()}${extname(file.originalname)}`;
                callback(null, uniqueName);
            },
        }),
    }))
    async createPayment(@Body() createPaymentRequest: CreatePaymentRequest, @Req() req, @UploadedFile() file: Express.Multer.File, @Res() res: Response) {
        try {
            const user = req.user;

            if (!user) {
                return res.status(401).json({
                    message: 'المستخدم غير موجود',
                });
            }

            createPaymentRequest.user_id = user.sub;

            createPaymentRequest.payment_image = `https://athrshares.com/uploads/payment_images/${file.filename}`;

            const payment = await this.paymentService.createPayment(createPaymentRequest);

            return res.status(201).json({
                message: 'تمت العملية بنجاح',
                data: payment,
            });

        } catch (err) {
            return res.status(400).json({
                message: 'حدث خطأ ما',
                error: err.message,
            });
        }
    }
}
