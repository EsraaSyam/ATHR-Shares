import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RealtyEntity } from 'src/realty/entities/realty.entity';
import { Repository } from 'typeorm';
import { PriceDetailsEntity } from './entities/price-details.entity';
import { CreatePaymentRequest } from './requests/create-payment.request';
import { PaymentEntity } from './entities/payment.entity';
import { GetPaymentDetailsRequest } from './requests/get-payment-detils.request';

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(RealtyEntity)
        private realtysRepository: Repository<RealtyEntity>,

        @InjectRepository(PaymentEntity)
        private paymentsRepository: Repository<PaymentEntity>,

        @InjectRepository(PriceDetailsEntity)
        private priceDetailsRepository: Repository<PriceDetailsEntity>,
    ) { }

    async getPriceDetails(getPaymentDetailsRequest: GetPaymentDetailsRequest) {
        const realty = await this.realtysRepository.findOne({ where: { id: getPaymentDetailsRequest.realty_id }, relations: ['details', 'investmentDetails', 'images'] });

        const realty_price = realty.investmentDetails.unit_price;

        if (getPaymentDetailsRequest.net_share_count === 0) {
            if (getPaymentDetailsRequest.payment_type === 'cash') {
                const service_charge = (realty.investmentDetails.service_charge / 100) * realty_price;
                return {
                    realty_price: realty_price,
                    service_charge: service_charge,
                    total_price: realty_price + service_charge,
                }
            } else {
                const Month_12 = realty.investmentDetails.payment_plan.month_12;
                const Month_18 = realty.investmentDetails.payment_plan.month_18;
                const Month_24 = realty.investmentDetails.payment_plan.month_24;

                let installment_type = getPaymentDetailsRequest.installment_type;

                const service_charge = (realty.investmentDetails.service_charge / 100) * realty.investmentDetails.down_payment;

                return {
                    realty_price: realty_price,
                    realty_down_payment: realty.investmentDetails.down_payment,
                    installment_type: installment_type === 'month_12' ? Month_12 : installment_type === 'month_18' ? Month_18 : Month_24,
                    service_charge: service_charge,
                    total_price: realty.investmentDetails.down_payment + service_charge,
                }
            }
        } else {
            if (getPaymentDetailsRequest.payment_type == 'cash') {
                const service_charge = (realty.investmentDetails.service_charge / 100) * realty_price;
                return {
                    realty_price: realty_price,
                    net_share_price: realty.investmentDetails.net_share_price,
                    service_charge: service_charge,
                    total_price: realty_price + service_charge,
                }
            } else {
                const Month_12 = realty.investmentDetails.payment_plan.month_12;
                const Month_18 = realty.investmentDetails.payment_plan.month_18;
                const Month_24 = realty.investmentDetails.payment_plan.month_24;

                let installment_type = getPaymentDetailsRequest.installment_type;

                const service_charge = (realty.investmentDetails.service_charge / 100) * realty.investmentDetails.down_payment;

                return {
                    realty_price: realty_price,
                    net_share_price: realty.investmentDetails.net_share_price,
                    realty_down_payment: realty.investmentDetails.down_payment,
                    installment_type: installment_type === 'month_12' ? Month_12 : installment_type === 'month_18' ? Month_18 : Month_24,
                    service_charge: service_charge,
                    total_price: realty.investmentDetails.down_payment + service_charge,
                }

            }
        }
    }

    async createPayment(createPaymentRequest: CreatePaymentRequest) {
        const realty = await this.realtysRepository.findOne({ where: { id: createPaymentRequest.realty_id }, relations: ['details', 'investmentDetails', 'images'] });

        const realty_price = realty.investmentDetails.unit_price;

        const priceDetails = new PriceDetailsEntity();

        if (createPaymentRequest.net_share_count === 0) {
            if (createPaymentRequest.payment_type === 'cash') {
                const service_charge = (realty.investmentDetails.service_charge / 100) * realty_price;

                priceDetails.unit_price = realty_price;
                priceDetails.service_charge = service_charge;
                priceDetails.total_price = realty_price + service_charge;
            } else {
                const Month_12 = realty.investmentDetails.payment_plan.month_12;
                const Month_18 = realty.investmentDetails.payment_plan.month_18;
                const Month_24 = realty.investmentDetails.payment_plan.month_24;

                let installment_type = createPaymentRequest.installment_type;

                const service_charge = (realty.investmentDetails.service_charge / 100) * realty.investmentDetails.down_payment;

                priceDetails.unit_price = realty_price;
                priceDetails.down_payment = realty.investmentDetails.down_payment;
                priceDetails.monthly_installment = installment_type === 'month_12' ? Month_12 : installment_type === 'month_18' ? Month_18 : Month_24;
                priceDetails.service_charge = service_charge;
                priceDetails.total_price = realty.investmentDetails.down_payment + service_charge;
            }
        } else {
            if (createPaymentRequest.payment_type === 'cash') {
                const service_charge = (realty.investmentDetails.service_charge / 100) * realty_price;

                priceDetails.unit_price = realty_price;
                priceDetails.net_share_price = realty.investmentDetails.net_share_price;
                priceDetails.service_charge = service_charge;
                priceDetails.total_price = realty_price + service_charge;
            } else {
                const Month_12 = realty.investmentDetails.payment_plan.month_12;
                const Month_18 = realty.investmentDetails.payment_plan.month_18;
                const Month_24 = realty.investmentDetails.payment_plan.month_24;

                let installment_type = createPaymentRequest.installment_type;

                const service_charge = (realty.investmentDetails.service_charge / 100) * realty.investmentDetails.down_payment;

                priceDetails.unit_price = realty_price;
                priceDetails.net_share_price = realty.investmentDetails.net_share_price;
                priceDetails.down_payment = realty.investmentDetails.down_payment;
                priceDetails.monthly_installment = installment_type === 'month_12' ? Month_12 : installment_type === 'month_18' ? Month_18 : Month_24;
                priceDetails.service_charge = service_charge;
                priceDetails.total_price = realty.investmentDetails.down_payment + service_charge;
            }
        }

        priceDetails.realty = { id: createPaymentRequest.realty_id } as any;

        await this.priceDetailsRepository.save(priceDetails);

        const payment = new PaymentEntity();

        payment.realty_id = createPaymentRequest.realty_id;

        payment.price_details = priceDetails;

        payment.payment_type = createPaymentRequest.payment_type;

        payment.net_share_count = createPaymentRequest.net_share_count;

        payment.installment_type = createPaymentRequest.installment_type;

        payment.payment_method = createPaymentRequest.payment_method;

        payment.payment_image = createPaymentRequest.payment_image;

        payment.last_installment_payment = new Date();

        const nextPaymentDate = new Date(payment.last_installment_payment);

        nextPaymentDate.setDate(nextPaymentDate.getDate() + 30); // 30 days

        payment.next_payment_date = nextPaymentDate;

        payment.user = { id: createPaymentRequest.user_id } as any;

        await this.paymentsRepository.save(payment);

        return payment;
    }

}
