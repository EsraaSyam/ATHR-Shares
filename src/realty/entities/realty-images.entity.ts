import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RealtyEntity } from "./realty.entity";

@Entity('realty_images')
export class RealtyImagesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    image_url: string;

    @Column({default: true})
    is_active?: boolean = true;

    @Column({nullable: true})
    description?: string;

    @ManyToOne(() => RealtyEntity, (realty) => realty.images, { onDelete: 'CASCADE' })
    realty: RealtyEntity;
}