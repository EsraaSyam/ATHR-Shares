import { PaymentEntity } from "src/payment/entities/payment.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PaymentForInvestmentEntity } from "./payment-investment.entity";

@Entity('investment_payment_details')
export class InvestmentPaymentDetailsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'double precision', nullable: true })
    unit_price: number = 0;

    @Column({ type: 'double precision', nullable: true })
    down_payment: number = 0;

    @Column({ type: 'double precision', nullable: true })
    paid_installment: number = 0;

    @Column({ type: 'double precision', nullable: true })
    next_installment_price: number;

    @Column({ type: 'double precision', nullable: true, default: 0 })
    net_share_price: number = 0;

    @Column({ type: 'double precision', nullable: true, default: 0 })
    net_share_count: number = 0;

    @Column({ type: 'double precision', nullable: true, default: 0 })
    total_price: number = 0;

    @Column({ type: 'date', nullable: true })
    next_installment_date: Date;

    @OneToOne(() => PaymentEntity, (payment) => payment.investment_payment_details, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn()
    payment: PaymentEntity;

    @OneToMany(() => PaymentForInvestmentEntity, (paymentForInvestment) => paymentForInvestment.investmentPaymentDetails, { eager: true, cascade: ['insert', 'update'] })
    payments: PaymentForInvestmentEntity[];

}