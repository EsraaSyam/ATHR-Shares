import { PaymentEntity } from "src/payment/entities/payment.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('investment_payment_details')
export class InvestmentPaymentDetailsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'double precision', nullable: true })
    unit_price: number;

    @Column({ type: 'double precision', nullable: true })
    down_payment: number;

    @Column({ type: 'double precision', nullable: true })
    paid_installment: number;

    @Column({ type: 'double precision', nullable: true })
    next_installment_price: number;

    @Column({ type: 'double precision', nullable: true })
    net_share_price: number;

    @Column({ type: 'double precision', nullable: true })
    net_share_count: number = 0;

    @Column({ type: 'double precision', nullable: true })
    total_price: number;

    @OneToOne(() => PaymentEntity, (payment) => payment.investment_payment_details, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn()
    payment: PaymentEntity;
}