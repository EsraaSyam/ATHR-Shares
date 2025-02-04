import { UserEntity } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

@Entity('notifications')
export class NotificationsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    body: string;

    @ManyToOne(() => UserEntity, (user) => user.notifications, { onDelete: 'CASCADE' })
    user: UserEntity;
}