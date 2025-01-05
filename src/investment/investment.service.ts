import { Body, Injectable, Req, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from 'src/payment/entities/payment.entity';
import { PriceDetailsEntity } from 'src/payment/entities/price-details.entity';
import { RealtyEntity } from 'src/realty/entities/realty.entity';
import { Repository } from 'typeorm';
import { InvestmentPaymentDetailsEntity } from './investment-details.entity';
import { GetInvestmentPaymentDetailsRequest } from './requests/get-investment-payment-details.request';
import { Response } from 'express';

@Injectable()
export class InvestmentService {
    constructor(
        // @InjectRepository(RealtyEntity)
        // private realtysRepository: Repository<RealtyEntity>,

        @InjectRepository(PaymentEntity)
        private paymentsRepository: Repository<PaymentEntity>,

        // @InjectRepository(PriceDetailsEntity)
        // private priceDetailsRepository: Repository<PriceDetailsEntity>,

        @InjectRepository(InvestmentPaymentDetailsEntity)
        private investmentPaymentDetailsRepository: Repository<InvestmentPaymentDetailsEntity>,

    ) { }

    async getInvestmentPaymentDetails(@Body() body: GetInvestmentPaymentDetailsRequest, @Req() req, @Res() res: Response) {


    }


}
