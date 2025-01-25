import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "src/users/user.entity";
import { InstallmentType, PaymentTypes, PaymentMethods, PaymentStatus } from "../payment.enum";
import { PriceDetailsEntity } from "./price-details.entity";
import { InvestmentPaymentDetailsEntity } from "src/investment/entities/investment-details.entity";

@Entity('payment')
export class PaymentEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    realty_id: number;

    @Column({nullable: true})
    payment_type: PaymentTypes;

    @Column({ nullable: true })
    net_share_count: number = 0;

    @Column({ nullable: true })
    installment_type: InstallmentType;

    @Column({ nullable: true })
    payment_method: PaymentMethods;

    @Column({ nullable: true })
    payment_image: string;

    @OneToOne(() => PriceDetailsEntity, { cascade: true, eager: true })
    @JoinColumn()
    price_details: PriceDetailsEntity;

    @Column({ nullable: true })
    payment_status: PaymentStatus = PaymentStatus.PENDING;

    @ManyToOne(() => UserEntity, (user) => user.payments, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' , nullable: true })
    created_at: Date = new Date();

    @Column({ type: 'timestamp', nullable: true })
    last_installment_payment: Date;

    @Column({ type: 'timestamp', nullable: true })
    next_payment_date: Date;

    @OneToOne(() => InvestmentPaymentDetailsEntity, (investmentPaymentDetails) => investmentPaymentDetails.payment, {
        eager: true,
        cascade: ['insert', 'update'],
    })
    @JoinColumn()
    investment_payment_details: InvestmentPaymentDetailsEntity;

    @Column({ nullable: true })
    user_id: number;

    @Column({ nullable: true })
    is_active: boolean = true;
}