import { RealtyDetailsEntity } from "src/realty/entities/realty_details.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('realty')
export class RealtyEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true, default: true })
    is_avaliable?: boolean;

    @Column({ nullable: true, default: true })
    is_active?: boolean;

    @Column()
    background_image: string;

    @Column()
    title: string;

    @Column()
    owner_name: string;

    @Column({ type: 'double precision', nullable: true })
    net_quarter?: number;

    @Column({ nullable: true })
    sale_date?: Date;

    @Column({ type: 'double precision', nullable: true })
    net_return?: number;

    @Column({ type: 'double precision', nullable: true })
    down_payment?: number;

    @Column({ nullable: true })
    user_id?: number;

    @OneToOne(() => RealtyDetailsEntity, { cascade: true }) 
    @JoinColumn()
    details: RealtyDetailsEntity;
}
