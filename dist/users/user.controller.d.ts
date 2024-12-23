import { UsersService } from './user.service';
import { CreateUserRequest } from './requests/create-user.requests';
import { Response } from 'express';
import { UpdateUserRequest } from './requests/update-user.request';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    createUser(createUserRequest: CreateUserRequest, res: Response): Promise<void>;
    findAllUsers(res: any): Promise<void>;
    updateUser(res: any, id: number, updateUserRequest: UpdateUserRequest): Promise<void>;
    softDeleteUser(res: any, id: number): Promise<void>;
}
