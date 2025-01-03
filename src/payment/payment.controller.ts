import { Body, Controller, Get, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PriceDetailsEntity } from './entities/price-details.entity';
import { Response } from 'express';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { CreatePaymentRequest } from './requests/create-payment.request';
import { GetPaymentDetailsRequest } from './requests/get-payment-detils.request';
import { AuthService } from 'src/auth/auth.service';

@Controller('payment')
export class PaymentController {
    constructor( 
        private readonly paymentService: PaymentService,
        private readonly authService: AuthService,
        
    ) { }

    @Get('price-details')
    @UseInterceptors(AnyFilesInterceptor())
    async getPriceDetails(@Body() getPaymrntDetailsRequest:GetPaymentDetailsRequest, @Res() res: Response){
        const paymentDetails = await this.paymentService.getPriceDetails(getPaymrntDetailsRequest);
        return res.status(200).json({
            message: 'تمت بنجاح',
            data: paymentDetails,
        });
    }

    @Post('create-payment')
    @UseInterceptors(FileInterceptor('payment_image'))
    async createPayment(@Body() createPaymentRequest :CreatePaymentRequest, @Req() req,  @UploadedFile() file: Express.Multer.File, @Res() res: Response){
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(401).json({
                message: 'لا يوجد توكن',
            });
        }

        const user = await this.authService.getUserByToken(token);

        if (!user) {
            return res.status(401).json({
                message: 'المستخدم غير موجود',
            });
        }

        createPaymentRequest.user_id = Number(user.id);


        createPaymentRequest.payment_image = `http://localhost:${process.env.PORT}/uploads/${file.fieldname}`;

        const payment = await this.paymentService.createPayment(createPaymentRequest);

        return res.status(201).json({
            message: 'Payment created successfully',
            data: payment,
        });
    }
}
