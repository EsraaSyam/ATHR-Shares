import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../users/user.entity';

@Entity('tokens')
export class TokenEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, user => user.tokens)
    @JoinColumn({ name: 'userId' })
    user: UserEntity;

    @Column()
    accessToken: string;
}
