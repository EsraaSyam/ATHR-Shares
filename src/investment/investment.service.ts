import { Body, Injectable, Req, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from 'src/payment/entities/payment.entity';
import { PriceDetailsEntity } from 'src/payment/entities/price-details.entity';
import { RealtyEntity } from 'src/realty/entities/realty.entity';
import { Repository } from 'typeorm';
import { InvestmentPaymentDetailsEntity } from './investment-details.entity';
import { GetInvestmentPaymentDetailsRequest } from './requests/get-investment-payment-details.request';
import { Response } from 'express';
import { RealtyService } from 'src/realty/realty.service';
import { UsersService } from 'src/users/user.service';

@Injectable()
export class InvestmentService {
    constructor(
        @InjectRepository(RealtyEntity)
        private realtysRepository: Repository<RealtyEntity>,

        @InjectRepository(PaymentEntity)
        private paymentsRepository: Repository<PaymentEntity>,

        // @InjectRepository(PriceDetailsEntity)
        // private priceDetailsRepository: Repository<PriceDetailsEntity>,

        @InjectRepository(InvestmentPaymentDetailsEntity)
        private investmentPaymentDetailsRepository: Repository<InvestmentPaymentDetailsEntity>,

        private realtyService: RealtyService,

        private userService: UsersService,

    ) { }

    async getInvestmentPaymentDetails(body: GetInvestmentPaymentDetailsRequest) {
        const realty = await this.realtyService.findRealtyById(body.realty_id);

        const user = await this.userService.findById(body.user_id);

        console.log('user', user);
        console.log('realty', realty);

    }


}
