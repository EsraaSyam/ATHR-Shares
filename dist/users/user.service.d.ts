import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserRequest } from './requests/create-user.requests';
import { UpdateUserRequest } from './requests/update-user.request';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<UserEntity>);
    create(createUserRequest: CreateUserRequest): Promise<CreateUserRequest & UserEntity>;
    updateById(id: number, updateUserRequest: UpdateUserRequest): Promise<{
        id: number;
        full_name: string;
        phone_number: string;
        email: string;
        id_photo: string;
        passport_photo: string;
        is_active: boolean;
        resetCode: string;
        resetCodeExpiration: Date;
        role: import("./user.enum").Role;
    }>;
    findAll(): Promise<UserEntity[]>;
    findByEmail(email: string): Promise<UserEntity>;
    findById(id: number): Promise<UserEntity>;
    softDeleteById(id: number): Promise<void>;
}
