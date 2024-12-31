import { RealtyEntity } from "src/realty/entities/realty.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('payment_details')
export class PaymentDetailsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    buy_unit: boolean = false;

    @Column({ nullable: true })
    buy_slice: boolean = false;

    @Column({ nullable: true })
    net_share_count: number = 0;

    @Column({ nullable: true })
    cash_payment: boolean = false;

    @Column({ nullable: true })
    installment_payment: boolean = false;

    @Column({ nullable: true })
    total_price: number = 0;

    @Column('boolean', { array: true, nullable: true })
    installment_type: boolean[]  = [false, false, false];

    @ManyToOne(() => RealtyEntity, { cascade: true })
    @JoinColumn()
    realty: RealtyEntity;
}