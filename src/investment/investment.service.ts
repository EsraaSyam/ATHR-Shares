import { BadRequestException, Body, Injectable, NotFoundException, Req, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from 'src/payment/entities/payment.entity';
import { PriceDetailsEntity } from 'src/payment/entities/price-details.entity';
import { RealtyEntity } from 'src/realty/entities/realty.entity';
import { Repository } from 'typeorm';
import { InvestmentPaymentDetailsEntity } from './entities/investment-details.entity';
import { GetInvestmentPaymentDetailsRequest } from './requests/get-investment-payment-details.request';
import { Response } from 'express';
import { RealtyService } from 'src/realty/realty.service';
import { UsersService } from 'src/users/user.service';
import { isValidationOptions, validate } from 'class-validator';
import { PayInvestmentPaymentRequest } from './requests/pay-investment-payment.request';
import { PaymentForInvestmentEntity } from './entities/payment-investment.entity';
import * as moment from 'moment';
import { UserEntity } from 'src/users/user.entity';


@Injectable()
export class InvestmentService {
    constructor(
        @InjectRepository(RealtyEntity)
        private realtysRepository: Repository<RealtyEntity>,

        @InjectRepository(PaymentEntity)
        private paymentsRepository: Repository<PaymentEntity>,

        // @InjectRepository(PriceDetailsEntity)
        // private priceDetailsRepository: Repository<PriceDetailsEntity>,

        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,

        @InjectRepository(PaymentForInvestmentEntity)
        private paymentForInvestmentRepository: Repository<PaymentForInvestmentEntity>,

        @InjectRepository(InvestmentPaymentDetailsEntity)
        private investmentPaymentDetailsRepository: Repository<InvestmentPaymentDetailsEntity>,

        private realtyService: RealtyService,

        private userService: UsersService,

    ) { }

    private formatDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    async getInvestmentPaymentDetailsForUnits(body: GetInvestmentPaymentDetailsRequest) {
        const realty = await this.realtyService.findRealtyById(body.realty_id);


        const user = await this.userService.findById(body.user_id);

        const investmentPaymentDetails = new InvestmentPaymentDetailsEntity();

        investmentPaymentDetails.unit_price = realty.investmentDetails.unit_price;
        investmentPaymentDetails.down_payment = realty.investmentDetails.down_payment;
        const paymentForRealty = user.payments.find(payment => payment.realty_id === realty.id);
        const monthly_installment = paymentForRealty.price_details.monthly_installment;
        investmentPaymentDetails.paid_installment = 0; // must be edit
        investmentPaymentDetails.next_installment_price = monthly_installment;
        investmentPaymentDetails.next_installment_date = paymentForRealty.next_payment_date;
        // console.log('paymentForRealty', paymentForRealty);
        investmentPaymentDetails.total_price = monthly_installment;

        investmentPaymentDetails.payment = paymentForRealty;

        return {
            unit_price: investmentPaymentDetails.unit_price,
            down_payment: investmentPaymentDetails.down_payment,
            paid_installment: investmentPaymentDetails.paid_installment,
            next_installment_price: investmentPaymentDetails.next_installment_price,
            next_installment_date: this.formatDate(investmentPaymentDetails.next_installment_date),
            total_price: investmentPaymentDetails.total_price,
        }
    }

    async getInvestmentPaymentDetailsForNetShare(body: GetInvestmentPaymentDetailsRequest) {
        const realty = await this.realtyService.findRealtyById(body.realty_id);

        const user = await this.userService.findById(body.user_id);

        const investmentPaymentDetails = new InvestmentPaymentDetailsEntity();

        investmentPaymentDetails.unit_price = realty.investmentDetails.unit_price;
        const paymentForRealty = user.payments.find(payment => payment.realty_id === realty.id);
        const monthly_installment = paymentForRealty.price_details.monthly_installment;
        investmentPaymentDetails.net_share_count = paymentForRealty.net_share_count;
        investmentPaymentDetails.net_share_price = realty.investmentDetails.net_share_price;
        investmentPaymentDetails.paid_installment = 0; // must be edit
        investmentPaymentDetails.next_installment_price = monthly_installment;
        investmentPaymentDetails.next_installment_date = paymentForRealty.next_payment_date;
        investmentPaymentDetails.total_price = monthly_installment;

        investmentPaymentDetails.payment = paymentForRealty;

        return {
            unit_price: investmentPaymentDetails.unit_price,
            net_share_price: investmentPaymentDetails.net_share_price,
            net_share_count: investmentPaymentDetails.net_share_count,
            paid_installment: investmentPaymentDetails.paid_installment,
            next_installment_price: investmentPaymentDetails.next_installment_price,
            next_installment_date: this.formatDate(investmentPaymentDetails.next_installment_date),
            total_price: investmentPaymentDetails.total_price,
            // rem_net_share = realty.investmentDetails.
        }
    }

    async updateInvestmentPaymentDetailsById(
        investmentPaymentDetailsId: number,
        updateData: Partial<InvestmentPaymentDetailsEntity>,
    ): Promise<InvestmentPaymentDetailsEntity> {
        const investmentPaymentDetails = await this.investmentPaymentDetailsRepository.findOneBy({ id: investmentPaymentDetailsId });

        if (!investmentPaymentDetails) {
            throw new NotFoundException(`Investment payment details with ID ${investmentPaymentDetailsId} not found`);
        }

        Object.assign(investmentPaymentDetails, updateData);

        await this.investmentPaymentDetailsRepository.save(investmentPaymentDetails);

        return investmentPaymentDetails;
    }

    async payInvestmentPaymentForUnits(body: PayInvestmentPaymentRequest) {
        const realty = await this.realtyService.findRealtyById(body.realty_id);

        const user = await this.usersRepository.findOne({
            where: { id: body.user_id.toString() },
            relations: [
                'payments', 
                'payments.investment_payment_details', 
                'payments.investment_payment_details.payments'
            ],
        });

        const userPayment = user.payments.find(payment => payment.realty_id === realty.id);

        const investmentPaymentDetails = userPayment.investment_payment_details;

        // console.log("investmentPaymentDetails", investmentPaymentDetails);

        // console.log("user", user);
        // console.log("userPayment", userPayment);

        const getInvestmentPaymentDetails = await this.getInvestmentPaymentDetailsForUnits(body);

        const paymentDetails = new PaymentForInvestmentEntity();

        paymentDetails.payment_method = body.payment_method;

        paymentDetails.payment_image = body.payment_image;

        if (!investmentPaymentDetails) {
            const newInvestmentPaymentDetails = new InvestmentPaymentDetailsEntity();

            newInvestmentPaymentDetails.unit_price = getInvestmentPaymentDetails.unit_price;

            newInvestmentPaymentDetails.down_payment = getInvestmentPaymentDetails.down_payment;

            newInvestmentPaymentDetails.paid_installment = 0;

            newInvestmentPaymentDetails.next_installment_price = getInvestmentPaymentDetails.next_installment_price;

            newInvestmentPaymentDetails.next_installment_date = new Date(getInvestmentPaymentDetails.next_installment_date);

            newInvestmentPaymentDetails.total_price = getInvestmentPaymentDetails.total_price;

            newInvestmentPaymentDetails.payments = [paymentDetails];

            userPayment.investment_payment_details = newInvestmentPaymentDetails;

            const user3 = await this.paymentsRepository.save(userPayment);

            user.payments.find(payment => payment.realty_id === realty.id).investment_payment_details = user3.investment_payment_details;

            user.payments.find(payment => payment.realty_id === realty.id).investment_payment_details.payments = user3.investment_payment_details.payments;

            await this.usersRepository.save(user);
        } else {

            investmentPaymentDetails.paid_installment += investmentPaymentDetails.total_price;

            investmentPaymentDetails.payments.push(paymentDetails);

            const nextInstallmentDate = new Date(investmentPaymentDetails.next_installment_date); 

            nextInstallmentDate.setDate(nextInstallmentDate.getDate() + 30);

            investmentPaymentDetails.next_installment_date = nextInstallmentDate;

            const neww =  await this.investmentPaymentDetailsRepository.save(investmentPaymentDetails);

            // console.log("neww", neww);
        }
    
    }



    async payInvestmentPaymentForNetShare(body: PayInvestmentPaymentRequest) {
        const realty = await this.realtyService.findRealtyById(body.realty_id);

        const user = await this.usersRepository.findOne({
            where: { id: body.user_id.toString() },
            relations: [
                'payments', 
                'payments.investment_payment_details', 
                'payments.investment_payment_details.payments'
            ],
        });

        const userPayment = user.payments.find(payment => payment.realty_id === realty.id);

        console.log("userPayment", userPayment);

        const investmentPaymentDetails = userPayment.investment_payment_details;

        console.log("investmentPaymentDetails", investmentPaymentDetails);

        // console.log("user", user);
        // console.log("userPayment", userPayment);

        const getInvestmentPaymentDetails = await this.getInvestmentPaymentDetailsForNetShare(body);

        console.log("getInvestmentPaymentDetails", getInvestmentPaymentDetails);

        const paymentDetails = new PaymentForInvestmentEntity();

        paymentDetails.payment_method = body.payment_method;

        paymentDetails.payment_image = body.payment_image;

        console.log("paymentDetails", paymentDetails);

        // if (!investmentPaymentDetails) {
        //     const newInvestmentPaymentDetails = new InvestmentPaymentDetailsEntity();

        //     newInvestmentPaymentDetails.unit_price = getInvestmentPaymentDetails.unit_price;

        //     // newInvestmentPaymentDetails.down_payment = getInvestmentPaymentDetails.down_payment;

        //     newInvestmentPaymentDetails.paid_installment = 0;

        //     newInvestmentPaymentDetails.next_installment_price = getInvestmentPaymentDetails.next_installment_price;

        //     newInvestmentPaymentDetails.next_installment_date = new Date(getInvestmentPaymentDetails.next_installment_date);

        //     newInvestmentPaymentDetails.total_price = getInvestmentPaymentDetails.total_price;

        //     newInvestmentPaymentDetails.payments = [paymentDetails];

        //     userPayment.investment_payment_details = newInvestmentPaymentDetails;

        //     const user3 = await this.paymentsRepository.save(userPayment);

        //     user.payments.find(payment => payment.realty_id === realty.id).investment_payment_details = user3.investment_payment_details;

        //     user.payments.find(payment => payment.realty_id === realty.id).investment_payment_details.payments = user3.investment_payment_details.payments;

        //     await this.usersRepository.save(user);
        // } else {

        //     investmentPaymentDetails.paid_installment += investmentPaymentDetails.total_price;

        //     investmentPaymentDetails.payments.push(paymentDetails);

        //     const nextInstallmentDate = new Date(investmentPaymentDetails.next_installment_date); 

        //     nextInstallmentDate.setDate(nextInstallmentDate.getDate() + 30);

        //     investmentPaymentDetails.next_installment_date = nextInstallmentDate;

        //     const neww =  await this.investmentPaymentDetailsRepository.save(investmentPaymentDetails);

        //     // console.log("neww", neww);
        // }
    
    }

}
