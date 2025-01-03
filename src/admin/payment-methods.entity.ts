import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('payment_methods')
export class PaymentMethodsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('json', { nullable: true })
    payment_methods: { [key: string]: string } = {
        'Cash': 'Available',
        'Bank Transfer': 'Available',
        'Card Payment': 'Available'
    };
}