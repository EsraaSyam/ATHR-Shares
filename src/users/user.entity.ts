import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './user.enum';
import { PaymentEntity } from 'src/payment/entities/payment.entity';
import { TokenEntity } from 'src/auth/token.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column()
  full_name: string;

  @Column()
  phone_number: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  id_photo_front: string;

  @Column({ nullable: true })
  id_photo_back: string;

  @Column({ nullable: true })
  passport_photo: string;

  @Column({ nullable: true, default: true })
  is_active: boolean;

  @Column({ nullable: true })
  resetCode: string;

  @Column({ nullable: true })
  resetCodeExpiration: Date;

  @Column({ nullable: true })
  role: Role = Role.USER;

  @Column({ nullable: true })
  is_completed: boolean = false;

  @Column({ nullable: true })
  is_verified: boolean = false;

  @OneToMany(() => PaymentEntity, (payment) => payment.user) 
  payments: PaymentEntity[];

  @OneToMany(() => TokenEntity, token => token.user)
  tokens: TokenEntity[];

  @Column({ nullable: true })
  fcm_token: string;
}