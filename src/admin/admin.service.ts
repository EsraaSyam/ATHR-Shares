import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { UserEntity } from 'src/users/user.entity';
import { UsersService } from 'src/users/user.service';
import { Not, Repository } from 'typeorm';
import { AdminEntity } from '../auth/entities/admin.entity';
import * as bycrpt from 'bcrypt';
import { Role } from 'src/users/user.enum';
import { AdminUpdateUserRequest } from './requests/update-user.request';
import { UserResponse } from './response/user.response';
import { PaymentEntity } from 'src/payment/entities/payment.entity';
import { InstallmentType } from 'src/payment/payment.enum';
import { isAscii } from 'buffer';
import { RegisterAdminRequest } from './requests/register-admin-request';
import { UpdatePaymentRequest } from './requests/update-payment.request';
import { last } from 'rxjs';
import { RealtyEntity } from 'src/realty/entities/realty.entity';

@Injectable()
export class AdminService {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(AdminEntity)
        private adminRepository: Repository<AdminEntity>,
        @InjectRepository(PaymentEntity)
        private paymentRepository: Repository<PaymentEntity>,
        @InjectRepository(RealtyEntity)
        private realtyRepository: Repository<RealtyEntity>,
    ) { }

    private formatDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    async createAdmin(registerAdminRequest: RegisterAdminRequest) {
        const user = await this.findByEmail(registerAdminRequest.email);

        if (user) {
            return null;
        }


        const hashedPassword = await bycrpt.hash(registerAdminRequest.password, 10);

        registerAdminRequest.password = hashedPassword;

        return this.adminRepository.save(registerAdminRequest);
    }

    async findByEmail(email: string) {
        return this.adminRepository.findOne({ where: { email: email } });
    }

    async validateAdmin(email: string, password: string) {
        const admin = await this.findByEmail(email);

        console.log(admin);

        if (!admin) return null;

        const isPasswordValid = await bycrpt.compare(password, admin.password);

        if (admin && isPasswordValid) {
            return admin;
        }

        return null;
    }


    async getUsers(page: number = 1, limit: number = 10) {
        const [users, total_count] = await this.userRepository.findAndCount({
            where: {
                is_active: true,
                role: Not(Role.GUEST),
            },
            skip: (page - 1) * limit,
            take: limit,
            order: { id: 'ASC' }, 
        });

        const numberOfPages = Math.ceil(total_count / limit);


    
        return {
            total_count,
            page,
            limit,
            numberOfPages,
            users: users.map(user => ({
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                phone_number: user.phone_number,
                is_completed: user.is_completed,
                is_verified: user.is_verified,
            }))
        };
    }
    

    async deleteUser(id: number) {
        const user = await this.findUserById(id);
        if (!user) {
            throw new NotFoundException(`User with id ${id} does not exist`);
        }

        user.is_active = false;

        await this.userRepository.save(user);
    }

    async findUserById(id: number) {
        return await this.userRepository.findOne({ where: { id: id.toString() } });
    }

    async updateUser(id: number, updateUser: AdminUpdateUserRequest) {
        if (!Object.keys(updateUser).length) {
            throw new BadRequestException('At least one field is required to update user');
        }

        if (!id) {
            throw new BadRequestException('User id is required');
        }

        const [user, conflictingUsers] = await Promise.all([
            this.userRepository.findOne({ where: { id: id.toString() } }),
            this.userRepository.find({
                where: [
                    { email: updateUser.email, id: Not(id.toString()) },
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

        Object.entries(updateUser).forEach(([key, value]) => {
            if (value !== undefined) {
                updatedFields[key] = value;
            } else {
                updatedFields[key] = user[key];
            }
        });



        await this.userRepository.update(id, updatedFields);

        const { password, ...updatedUser } = { ...user, ...updatedFields };


        return new UserResponse(updatedUser);
    }

    async getPayments(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const take = limit;
      
        const [payments, total] = await this.paymentRepository.findAndCount({
          skip,
          take,
          where: [
            { is_active: true },
            { is_active: null }
          ],
          order: {
            created_at: 'ASC',
          },
        });
      
        payments.forEach(payment => {
          if (payment.is_active === null) {
            payment.is_active = true;
          }
        });

        const numberOfPages = Math.ceil(total / limit);
      
        return {
            total,
            page,
            limit,
            numberOfPages,
            payments,
        }
      }
      

    async getPaymentById(id: number) {
        const payment = await this.paymentRepository.findOne({ where: { id: id }});

        if (!payment) {
            throw new NotFoundException(`Payment with id ${id} does not exist`);
        }

        if (payment.is_active === null) {
            payment.is_active = true;
        }

        return payment;
    }

    async updatePayment(id: number, payment: UpdatePaymentRequest) {
        const paymentEntity = await this.paymentRepository.findOne({ where: { id: id } });

        if (!paymentEntity) {
            throw new NotFoundException(`Payment with id ${id} does not exist`);
        }

        paymentEntity.net_share_count = payment.net_share_count || paymentEntity.net_share_count;
        paymentEntity.payment_status = payment.payment_status || paymentEntity.payment_status;
        paymentEntity.installment_type = payment.installment_type || paymentEntity.installment_type;

        await this.paymentRepository.save(paymentEntity);

    }

    async deletePayment(id: number) {
        const payment = await this.paymentRepository.findOne({ where: { id: id } });

        if (!payment) {
            throw new NotFoundException(`Payment with id ${id} does not exist`);
        }

        payment.is_active = false;

        await this.paymentRepository.save(payment);
    }

    async getRealtys(page: number = 1, limit: number = 10) {
        const [realtys, total] = await this.realtyRepository.findAndCount({
            relations: ['details', 'investmentDetails', 'images', 'priceDetails'],
            order: { id: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
            where: { is_active: true },
        });
    
        if (!realtys.length) {
            throw new NotFoundException('لا توجد عقارات');
        }
    
        return {
            data: realtys,
            total_count: total,
            numberOfPages: Math.ceil(total / limit),
            currentPage: page,
        };
    }
    
}
