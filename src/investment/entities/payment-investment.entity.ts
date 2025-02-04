import { PaymentMethods } from "src/payment/payment.enum";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { InvestmentPaymentDetailsEntity } from "./investment-details.entity";

@Entity('payment_for_investment')
export class PaymentForInvestmentEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    payment_method: PaymentMethods;


    @Column({ nullable: true })
    payment_image: string;

    @ManyToOne(() => InvestmentPaymentDetailsEntity, (investmentPaymentDetails) => investmentPaymentDetails.payments, { onDelete: 'CASCADE', eager: false })
    investmentPaymentDetails: InvestmentPaymentDetailsEntity;

    @Column({ type: 'date', nullable: true })
    created_at: Date = new Date();
}