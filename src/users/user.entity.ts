import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './user.enum';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  full_name: string;

  @Column()
  phone_number: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column({ type: 'simple-array', nullable: true })
  id_photo: string[];

  @Column({ type: 'simple-array', nullable: true })
  passport_photo: string[];

  @Column({ nullable: true, default: true })
  is_active: boolean;

  @Column({ nullable: true })
  resetCode: string;

  @Column({ nullable: true })
  resetCodeExpiration: Date;

  @Column({ nullable: true })
  role: Role = Role.USER;
}
