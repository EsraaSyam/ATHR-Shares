import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RealtyEntity } from 'src/realty/entities/realty.entity';
import { Repository } from 'typeorm';
import { PaymentDetailsEntity } from './entities/payment-details.entity';
import { CreatePaymentRequest } from './requests/create-payment.request';
import { PaymentEntity } from './entities/payment.entity';

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(RealtyEntity)
        private realtysRepository: Repository<RealtyEntity>,

        @InjectRepository(PaymentEntity)
        private paymentsRepository: Repository<PaymentEntity>,

        @InjectRepository(PaymentDetailsEntity)
        private paymentDetailsRepository: Repository<PaymentDetailsEntity>,
    ) { }

    async getPaymentDetails(realty_id: number, buy_unit: boolean, cash_payment: boolean, net_share_count: number, installment_type: boolean[]) {
        const realty = await this.realtysRepository.findOne({ where: { id: realty_id} , relations: ['details', 'investmentDetails', 'images'] });
        
        const realty_price = realty.investmentDetails.unit_price;

        if (buy_unit) {
            const service_charge = (realty.investmentDetails.service_charge / 100) * realty_price;
            if (cash_payment) {
                return {
                    realt_price: realty_price,
                    service_charge: service_charge,
                    total_price: realty_price + service_charge,
                }

            } else {
                const Month_12 = realty.investmentDetails.payment_plan.month_12;
                const Month_18 = realty.investmentDetails.payment_plan.month_18;
                const Month_24 = realty.investmentDetails.payment_plan.month_24;

                let cnt = 0;

                for (const type of installment_type) {
                    cnt++;
                    if (type) {
                        break; 
                    }
                }

                const service_charge = (realty.investmentDetails.service_charge / 100) * realty.investmentDetails.down_payment;

                return {
                    realty_price: realty_price,
                    realty_down_payment: realty.investmentDetails.down_payment,
                    installment_type: cnt === 1 ? Month_12 : cnt === 2 ? Month_18 : Month_24,
                    service_charge: service_charge,
                    total_price: realty.investmentDetails.down_payment + service_charge,
                }
            }
        } else {
            if (cash_payment) {
                const service_charge = (realty.investmentDetails.service_charge / 100) * (realty.investmentDetails.net_share_price * net_share_count);
                return {
                    realty_price: realty_price,
                    net_share_price: realty.investmentDetails.net_share_price,
                    service_charge: service_charge,
                    total_price: realty.investmentDetails.net_share_price * net_share_count + service_charge,
                }
            } else {
                const Month_12 = realty.investmentDetails.payment_plan.month_12;
                const Month_18 = realty.investmentDetails.payment_plan.month_18;
                const Month_24 = realty.investmentDetails.payment_plan.month_24;

                let cnt = 0;

                for (const type of installment_type) {
                    cnt++;
                    if (type) {
                        break;
                    }
                }

                const service_charge = (realty.investmentDetails.service_charge / 100) * realty.investmentDetails.down_payment;

                return {
                    realty_price: realty_price,
                    net_share_price: realty.investmentDetails.net_share_price,
                    realty_down_payment: realty.investmentDetails.down_payment,
                    installment_type: cnt === 1 ? Month_12 : cnt === 2 ? Month_18 : Month_24,
                    service_charge: service_charge,
                    total_price: realty.investmentDetails.down_payment * net_share_count + service_charge,
                }
            }

        }

    }

    async createPayment(createPaymentRequest: CreatePaymentRequest) {
        const { 
            service_charge, 
            total_price, 
            realty_down_payment, 
            net_share_price, 
            installment_type 
        } = await this.getPaymentDetails(
            createPaymentRequest.realty_id, 
            createPaymentRequest.is_buy_unit, 
            createPaymentRequest.is_cash_payment, 
            createPaymentRequest.net_share_count, 
            createPaymentRequest.installment_type
        );

        console.log(service_charge);
    
        const paymentDetails = new PaymentDetailsEntity();
    
        paymentDetails.buy_unit = createPaymentRequest.is_buy_unit || null;
        paymentDetails.cash_payment = createPaymentRequest.is_cash_payment || null;
        paymentDetails.net_share_count = createPaymentRequest.net_share_count || null;
        paymentDetails.installment_type = createPaymentRequest.installment_type || null;
        paymentDetails.realty = await this.realtysRepository.findOne({ where: { id: createPaymentRequest.realty_id },
            relations: ['details', 'investmentDetails', 'images']
         });
        paymentDetails.realty.investmentDetails.service_charge = service_charge || null;
        paymentDetails.total_price = total_price || null;
        paymentDetails.realty.down_payment = realty_down_payment || null;
        paymentDetails.realty.investmentDetails.net_share_price = net_share_price || null;
        for (let i = 0; i < 3; i++) {
            console.log(installment_type[i]);
            paymentDetails.installment_type[i] = installment_type[i];
            console.log(paymentDetails.installment_type[i]);
        }
    
        await this.paymentDetailsRepository.save(paymentDetails);
        
        const paymentEntity = new PaymentEntity();
        paymentEntity.price_details = paymentDetails;
        paymentEntity.payment_status = false;
        paymentEntity.payment_date = new Date();
        paymentEntity.payment_image = createPaymentRequest.payment_image;
    
        await this.paymentsRepository.save(paymentEntity);
    }
    
}
