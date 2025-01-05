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
    async getPriceDetails(@Body() getPaymrntDetailsRequest:GetPaymentDetailsRequest,@Req() req, @Res() res: Response){
        const user = req.user;
        console.log(user)
        const paymentDetails = await this.paymentService.getPriceDetails(getPaymrntDetailsRequest);
        return res.status(200).json({
            message: 'تمت بنجاح',
            data: paymentDetails,
        });
    }

    @Post('create-payment')
    @Roles(Role.USER)
    @UseInterceptors(FileInterceptor('payment_image'))
    async createPayment(@Body() createPaymentRequest :CreatePaymentRequest, @Req() req,  @UploadedFile() file: Express.Multer.File, @Res() res: Response){
        const user = req.user; 

        if (!user) {
            return res.status(401).json({
                message: 'المستخدم غير موجود',
            });
        }

        createPaymentRequest.user_id = Number(user.sub);


        createPaymentRequest.payment_image = `http://localhost:${process.env.PORT}/uploads/${file.fieldname}`;

        const payment = await this.paymentService.createPayment(createPaymentRequest);

        return res.status(201).json({
            message: 'Payment created successfully',
            data: payment,
        });
    }
}
