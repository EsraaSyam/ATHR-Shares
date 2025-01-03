import { RealtyEntity } from "src/realty/entities/realty.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { InstallmentType, PaymentMethods, PaymentTypes } from "../payment.enum";
import { PaymentEntity } from "./payment.entity";

@Entity('payment_details')
export class PriceDetailsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'double precision', nullable: true })
    unit_price: number = 0;

    @Column({ type: 'double precision', nullable: true })
    down_payment: number = 0;

    @Column({ type: 'double precision', nullable: true })
    net_share_price: number = 0;

    @Column({ type: 'double precision', nullable: true })
    monthly_installment: number = 0;

    @Column({ type: 'double precision', nullable: true })
    service_charge: number = 0;

    @Column({ type: 'double precision', nullable: true })
    total_price: number = 0;

    @OneToOne(() => PaymentEntity)
    payment: PaymentEntity;


    @ManyToOne(() => RealtyEntity, (realty) => realty.priceDetails, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'realty_id' })
    realty: RealtyEntity;

}