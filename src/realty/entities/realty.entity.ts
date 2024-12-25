import { RealtyDetailsEntity } from "src/realty/entities/realty_details.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { InvestmentDetailsEntity } from "./investment-details.entity";
import { RealtyImagesEntity } from "./realty-images.entity";
import { RealtyBackgroundEntity } from "./realty-background.entity";

@Entity('realty')
export class RealtyEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true, default: true })
    is_avaliable?: boolean;

    @Column({ nullable: true, default: true })
    is_active?: boolean;

    @OneToOne(() => RealtyBackgroundEntity, { cascade: true })
    background_image: RealtyBackgroundEntity;

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

    @OneToOne(() => InvestmentDetailsEntity, { cascade: true })
    @JoinColumn()
    investmentDetails: InvestmentDetailsEntity;

    @OneToMany(() => RealtyImagesEntity, (image) => image.realty, { cascade: true })
    images?: RealtyImagesEntity[];

}