import { RealtyEntity } from "src/realty/entities/realty.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('investment_details')
export class InvestmentDetailsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('double precision')
    unit_price: number;

    @Column('double precision')
    net_share_price: number;

    @Column('double precision')
    down_payment: number;

    @Column('jsonb')
    payment_plan: {
        month_12?: number;
        month_18?: number;
        month_24?: number;
    };

    @Column('double precision', {nullable: true})
    service_charge: number = 0;
}
