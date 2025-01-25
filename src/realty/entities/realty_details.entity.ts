import { RealtyEntity } from "src/realty/entities/realty.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('realty_details')
export class RealtyDetailsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    bathroom_count: number;

    @Column()
    room_count: number;

    @Column({ type: 'double precision' })
    area: number;

    @Column()
    type: string;

    @Column({ type: 'double precision' })
    price: number;

    @Column("text", {nullable: true}) 
    features: string;

    @Column()
    longitude: string;

    @Column()
    latitude: string;

    @Column({nullable: true})
    net_share_count: number = 0;
}