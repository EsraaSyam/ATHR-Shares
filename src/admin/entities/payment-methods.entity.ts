import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('payment_methods')
export class PaymentMethodsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    method_name: string;

    @Column({nullable: true})
    value: string;

    @Column({default: true})
    is_active: boolean;
}
