import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { DeviceType } from "../enums/device.enum";

@Entity('devices')
export class DeviceEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    device_token: string;

    @Column()
    device_type: DeviceType;

    @ManyToOne(() => UserEntity, (user) => user.devices, { onDelete: 'CASCADE' })
    user: UserEntity;
}