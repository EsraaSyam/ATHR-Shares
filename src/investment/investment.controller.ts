import { Body, Controller, Get, Post, Req, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { InvestmentService } from './investment.service';
import { AnyFilesInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/users/enums/user.enum';
import { GetInvestmentPaymentDetailsRequest } from './requests/get-investment-payment-details.request';
import { Response } from 'express';
import { PayInvestmentPaymentRequest } from './requests/pay-investment-payment.request';
import { diskStorage } from 'multer';
import { extname } from 'path';

@UseGuards(RolesGuard)
@Controller('investment')
export class InvestmentController {
    constructor(private readonly investmentService: InvestmentService) { }

    @Get('unit/details')
    @Roles(Role.USER)
    @UseInterceptors(AnyFilesInterceptor())
    async getInvestmentPaymentDetails(@Body() body: GetInvestmentPaymentDetailsRequest, @Req() req, @Res() res: Response) {
        const user = req.user;
        body.user_id = user.sub;

        return res.json({
            message: 'تفاصيل السعر',
            data: await this.investmentService.getInvestmentPaymentDetailsForUnits(body),
        });
    }

    @Get('net_share/details')
    @Roles(Role.USER)
    @UseInterceptors(AnyFilesInterceptor())
    async getInvestmentPaymentDetailsForNetShare(@Body() body: GetInvestmentPaymentDetailsRequest, @Req() req, @Res() res: Response) {
        const user = req.user;
        body.user_id = user.sub;

        try {
            const data = await this.investmentService.getInvestmentPaymentDetailsForNetShare(body);
            return res.status(200).json({
                message: 'تفاصيل السعر',
                data,
            });
        } catch (e) {
            return res.status(400).json({
                message: 'لا يوجد بيانات',
                error: e.message,
            });
        }


    }

    @Post('unit/payment')
    @Roles(Role.USER)
    @UseInterceptors(
        FilesInterceptor('payment_image', 1, {
            storage: diskStorage({
                destination: './uploads/investmet-payment-images',
                filename: (req, file, callback) => {
                    const uniqueName = `${Date.now()}${extname(file.originalname)}`;
                    callback(null, uniqueName);
                },
            }),
        }),
    )
    async payInvestmentPaymentForUnits(@Body() body: PayInvestmentPaymentRequest, @UploadedFiles() file: Express.Multer.File, @Req() req, @Res() res: Response) {
        const user = req.user;
        body.user_id = user.sub;

        if (!file) {
            return res.status(400).json({
                message: 'لا يوجد ملف مرفق',
            });
        }

        const fileUrls = `/uploads/investmet-payment-images/${file[0].filename}`;

        body.payment_image = fileUrls;

        await this.investmentService.payInvestmentPaymentForUnits(body);

        return res.status(200).json({
            message: 'تم الدفع بنجاح',
        });

    }


    @Post('net-share/payment')
    @Roles(Role.USER)
    @UseInterceptors(
        FilesInterceptor('payment_image', 1, {
            storage: diskStorage({
                destination: './uploads/investmet-payment-images',
                filename: (req, file, callback) => {
                    const uniqueName = `${Date.now()}${extname(file.originalname)}`;
                    callback(null, uniqueName);
                },
            }),
        }),
    )
    async payInvestmentPaymentForNetShare(@Body() body: PayInvestmentPaymentRequest, @UploadedFiles() file: Express.Multer.File, @Req() req, @Res() res: Response) {
        const user = req.user;
        body.user_id = user.sub;

        if (!file) {
            return res.status(400).json({
                message: 'لا يوجد ملف مرفق',
            });
        }

        const fileUrls = `/uploads/investmet-payment-images/${file[0].filename}`;

        body.payment_image = fileUrls;

        await this.investmentService.payInvestmentPaymentForNetShare(body);

        return res.status(200).json({
            message: 'تم الدفع بنجاح',
        });

    }
}
