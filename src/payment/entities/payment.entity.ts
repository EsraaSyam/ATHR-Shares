import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PaymentDetailsEntity } from "./payment-details.entity";
import { UserEntity } from "src/users/user.entity";

@Entity('payment')
export class PaymentEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('jsonb', { nullable: true })
    price_details: PaymentDetailsEntity

    @Column('boolean', { array: true, nullable: true })
    payment_methods: boolean[] = [false, false, false];

    @Column({ nullable: true })
    payment_status: boolean = false;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    payment_date: Date;

    @Column({ nullable: true })
    payment_image: string;

    @ManyToOne(() => UserEntity, (user) => user.payments)
    user: UserEntity;
}