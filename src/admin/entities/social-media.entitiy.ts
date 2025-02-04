import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('social_media')
export class SocialMediaEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    url: string;

    @Column({default: true})
    is_active: boolean;
}