import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('banners')
export class BannerEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    image_url: string;

    @Column({ nullable: true, default: true })
    is_active: boolean;
}