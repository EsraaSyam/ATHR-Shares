import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CreateUserRequest } from './requests/create-user.requests';
import * as bycrpt from 'bcrypt';
import { UpdateUserRequest } from './requests/update-user.request';
import { NotFoundException } from 'src/exceptions/not-found.exception';
import { AuthService } from 'src/auth/auth.service';
import { Role } from './user.enum';
import { UserProfileResponse } from './responses/user-profile.response';
import { UpdateProfileRequest } from './requests/update-profile.request';
import { UserAlreadyExist } from 'src/exceptions/user-already-exist.exception';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
    ) { }

    async create(createUserRequest: CreateUserRequest) {
        if (!createUserRequest.email || !createUserRequest.password) {
            throw new BadRequestException('Email and password are required');
        }
        const [conflictingUsers] = await Promise.all([
            this.usersRepository.find({
                where: [
                    {
                        email: createUserRequest.email,
                        role: Role.USER,
                    },
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

    async updateById(id: number, updateUserRequest: UpdateUserRequest) {
        if (!Object.keys(updateUserRequest).length) {
            throw new BadRequestException('At least one field is required to update user');
        }

        if (!id) { 
            throw new BadRequestException('User id is required');
        }

        const [user, conflictingUsers] = await Promise.all([
            this.usersRepository.findOne({ where: { id: id.toString() } }),
            this.usersRepository.find({
                where: [
                    { email: updateUserRequest.email, id: Not(id.toString()) },
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

        const { password, ...updatedUser } = { ...user, ...updatedFields };

        return updatedUser;
    }

    async findAll() {
        return (await this.usersRepository.find()).filter(user => user.is_active === true);
    }

    async findByEmail(email: string) {
        return this.usersRepository.findOne({ where: { email } });
    }

    async findById(id: number) {
        return this.usersRepository.findOne({ where: { id: id.toString() }, relations: ['payments', 
                'payments.investment_payment_details', 
                'payments.investment_payment_details.payments'] });
    }

    async findByIdWithout(id: number) {
        return this.usersRepository.findOne({ where: { id: id.toString() } });
    }

    async softDeleteById(id: number) {
        const user = await this.findById(id);

        if (!user) {
            throw new NotFoundException(`User with email ${id} does not exist`);
        }

        user.is_active = false;
        await this.usersRepository.update(id, user);
    }

    async findByPhoneNumber(phone_number: string) {
        return this.usersRepository.findOne({ where: { phone_number } });
    }


    async getProfileData(id: string) {
        const user = await this.usersRepository.findOne({ where: { id: id } });

        if (!user) {
            throw new NotFoundException(`User with id ${id} does not exist`);
        }

        return new UserProfileResponse(user);
    }

    async updateProfile(id: string, updateProfileRequest: UpdateProfileRequest) {
        const [user, conflictingUsers] = await Promise.all([
            this.usersRepository.findOne({ where: { id } }),
            updateProfileRequest.email
                ? this.usersRepository.find({
                    where: [{ email: updateProfileRequest.email, id: Not(id) }],
                })
                : [],
        ]);

        if (!user) {
            throw new NotFoundException(`User with id ${id} does not exist`);
        }

        if (conflictingUsers.length > 0) {
            throw new UserAlreadyExist('User with this email already exists');
        }

        const updatedFields: Partial<UserEntity> = {};

        Object.entries(updateProfileRequest).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                updatedFields[key] = value;
            } else {
                updatedFields[key] = user[key];
            }
        });

        await this.usersRepository.update(id, updatedFields);
        const updatedUser = await this.usersRepository.findOne({ where: { id } });

        if (!updatedUser) {
            throw new InternalServerErrorException('Failed to update user');
        }

        return new UserProfileResponse(updatedUser);
    }

    async findUserById(id: string) {
        return this.usersRepository.findOne({ where: { id } });
    }

}
