import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CreateUserRequest } from './requests/create-user.requests';
import * as bycrpt from 'bcrypt';
import { UpdateUserRequest } from './requests/update-user.request';
import { NotFoundException } from 'src/exceptions/not-found.exception';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
    ) { }

    async create(createUserRequest: CreateUserRequest) {
        if (!createUserRequest.email ||!createUserRequest.password) {
            throw new BadRequestException('Email and password are required');
        }
        const [conflictingUsers] = await Promise.all([
            this.usersRepository.find({
                where: [
                    { email: createUserRequest.email },
                ],
            }),
        ]);

        if (conflictingUsers.length > 0) {
            throw new Error('User with this email already exists');
        }

        const hashedPassword = await bycrpt.hash(createUserRequest.password, 10);

        createUserRequest.password = hashedPassword;

        const newUser = this.usersRepository.save(createUserRequest);
        return newUser;
    }

    async updateById(id:number, updateUserRequest: UpdateUserRequest){
        if (!Object.keys(updateUserRequest).length) {
            throw new BadRequestException('At least one field is required to update user');
        }

        const [user, conflictingUsers] = await Promise.all([
            this.usersRepository.findOne({ where: { id } }),
            this.usersRepository.find({
                where: [
                    { email: updateUserRequest.email, id: Not(id) },
                ],
            }),
        ]);

        if (!user) {
            throw new NotFoundException(`User of id ${id} does not exist`);
        }

        if (conflictingUsers.length > 0) {
            throw new Error('User with this email already exists');
        }

        const updatedFields: Partial<UserEntity> = {};

        Object.entries(updateUserRequest).forEach(([key, value]) => {
            updatedFields[key] = value || user[key];
        });

        await this.usersRepository.update(id, updatedFields);

        const {password, ...updatedUser} = {...user, ...updatedFields};

        return updatedUser;
    }

    async findAll() {
        return (await this.usersRepository.find()).filter(user => user.is_active === true);
    }

    async findByEmail(email: string) {
        return this.usersRepository.findOne({ where: { email } });
    }

    async findById(id: number) {
        return this.usersRepository.findOne({ where: { id } });
    }

    async softDeleteById(id: number) {
        const user = await this.findById(id);

        if (!user) {
            throw new NotFoundException(`User with email ${id} does not exist`);
        }

        user.is_active = false;
        await this.usersRepository.update(id, user);
    }

}
