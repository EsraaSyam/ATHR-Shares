import { Body, Controller, Get, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentDetailsEntity } from './entities/payment-details.entity';
import { Response } from 'express';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { CreatePaymentRequest } from './requests/create-payment.request';

@Controller('payment')
export class PaymentController {
    constructor( 
        private readonly paymentService: PaymentService,
    ) { }

    @Get('price-details')
    @UseInterceptors(AnyFilesInterceptor())
    async getPriceDetails(@Body() paymentDetailsEntity:PaymentDetailsEntity, @Res() res: Response){
        const paymentDetails = await this.paymentService.getPaymentDetails(paymentDetailsEntity.realty.id, paymentDetailsEntity.buy_unit, paymentDetailsEntity.cash_payment, paymentDetailsEntity.net_share_count, paymentDetailsEntity.installment_type);
        return res.status(200).json({
            message: 'Payment details fetched successfully',
            data: paymentDetails,
        });
    }

    @Post('create-payment')
    @UseInterceptors(FileInterceptor('payment_image'))
    async createPayment(@Body() createPaymentRequest :CreatePaymentRequest,  @UploadedFile() file: Express.Multer.File, @Res() res: Response){
        createPaymentRequest.payment_image = `http://localhost:${process.env.PORT}/uploads/${file.filename}`;
        const payment = await this.paymentService.createPayment(createPaymentRequest);
        return res.status(201).json({
            message: 'Payment created successfully',
            data: payment,
        });
    }
}
