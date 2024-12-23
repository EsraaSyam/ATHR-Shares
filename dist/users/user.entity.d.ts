import { Role } from './user.enum';
export declare class UserEntity {
    id: number;
    full_name: string;
    phone_number: string;
    password: string;
    email: string;
    id_photo: string;
    passport_photo: string;
    is_active: boolean;
    resetCode: string;
    resetCodeExpiration: Date;
    role: Role;
}
