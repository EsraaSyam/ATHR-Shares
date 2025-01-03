import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "src/users/user.entity";
import { InstallmentType, PaymentTypes, PaymentMethods, PaymentStatus } from "../payment.enum";
import { PriceDetailsEntity } from "./price-details.entity";

@Entity('payment')
export class PaymentEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    payment_type: PaymentTypes;

    @Column({ nullable: true })
    net_share_count: number = 0;

    @Column({ nullable: true })
    installment_type: InstallmentType;

    @Column()
    payment_method: PaymentMethods;

    @Column()
    payment_image: string;

    @OneToOne(() => PriceDetailsEntity, { cascade: true, eager: true })
    @JoinColumn()
    price_details: PriceDetailsEntity;

    @Column({ nullable: true })
    payment_status: PaymentStatus = PaymentStatus.PENDING;

    @ManyToOne(() => UserEntity, (user) => user.payments, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'user_id' }) 
    user: UserEntity;
}