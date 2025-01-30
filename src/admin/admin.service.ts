import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/user.service';
import { Brackets, ILike, Like, Not, Repository } from 'typeorm';
import { AdminEntity } from '../auth/entities/admin.entity';
import * as bycrpt from 'bcrypt';
import { Role } from 'src/users/enums/user.enum';
import { AdminUpdateUserRequest } from './requests/update-user.request';
import { UserResponse } from './response/user.response';
import { PaymentEntity } from 'src/payment/entities/payment.entity';
import { InstallmentType } from 'src/payment/payment.enum';
import { isAscii } from 'buffer';
import { RegisterAdminRequest } from './requests/register-admin-request';
import { UpdatePaymentRequest } from './requests/update-payment.request';
import { last } from 'rxjs';
import { RealtyEntity } from 'src/realty/entities/realty.entity';
import { PaymentMethodsEntity } from './entities/payment-methods.entity';
import { CreatePaymentMethodRequest } from './requests/create-payment-methods.request';
import { UpdatePaymentMethodsRequest } from './requests/update-payment-methods.request';
import { json } from 'body-parser';
import { CreateSocialMediaRequest } from './requests/create-social-media.request';
import { SocialMediaEntity } from './entities/social-media.entitiy';
import { UpdateSocialMediaRequest } from './requests/update-social-media.request';
import { FirebaseService } from 'src/firebase/firebase.service';
import { DeviceEntity } from 'src/users/entities/device.entity';
import { Send } from 'express';
import { SendNotificationToAllRequest, SendNotificationToSpesificRequest } from './requests/send-notification.request';

@Injectable()
export class AdminService {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
        private readonly firebaseService: FirebaseService,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(AdminEntity)
        private adminRepository: Repository<AdminEntity>,
        @InjectRepository(PaymentEntity)
        private paymentRepository: Repository<PaymentEntity>,
        @InjectRepository(RealtyEntity)
        private realtyRepository: Repository<RealtyEntity>,
        @InjectRepository(PaymentMethodsEntity)
        private paymentMethodsRepository: Repository<PaymentMethodsEntity>,
        @InjectRepository(SocialMediaEntity)
        private socialMediaRepository: Repository<SocialMediaEntity>,
        @InjectRepository(DeviceEntity)
        private deviceRepository: Repository<DeviceEntity>,
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


    async getUsers(page: number = 1, limit: number = 10, search: string = '') {
        const queryBuilder = this.userRepository.createQueryBuilder('user');
        
        queryBuilder.where('user.is_active = :is_active', { is_active: true })
                    .andWhere('user.role != :role', { role: Role.GUEST });
    
        if (search) {
            queryBuilder.andWhere(
                new Brackets(qb => {
                    qb.where('user.full_name LIKE :search', { search: `%${search}%` })
                      .orWhere('user.phone_number LIKE :search', { search: `%${search}%` });
                })
            );
        }
    
        queryBuilder.skip((page - 1) * limit)
                    .take(limit)
                    .orderBy('user.id', 'ASC');
    
        const [users, total_count] = await queryBuilder.getManyAndCount();
    
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
    

    async searchUser(user: any) {
        console.log(user);
        const users = await this.userRepository.find({
            where: [
                { full_name: Like(`%${user}%`) },
                { phone_number: user },
            ],
        });

        return users;
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

        console.log(updateUser.password.length);

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
            if (value !== undefined && value.length > 0) {
                updatedFields[key] = value;
            } else {
                updatedFields[key] = user[key];
            }
        });

        if (updateUser.password.length > 0) {
            updatedFields.password = await bycrpt.hash(updateUser.password, 10);
        }

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

    async getAllPaymentMethods() {
        const paymentMethods = await this.paymentMethodsRepository.find();
        
        if (paymentMethods.length === 0) {
            throw new NotFoundException('No Payment Methods found');
        }
    
        return paymentMethods.sort((a, b) => a.id - b.id);
    }
    
    async getPaymentMethodById(id: number){
        const paymentMethod = await this.paymentMethodsRepository.findOne({ where: { id: id } });

        if (!paymentMethod) {
            throw new NotFoundException(`Payment Method with id ${id} does not exist`);
        }

        return paymentMethod;
    }

    async createPaymentMethod(method: CreatePaymentMethodRequest){
        return this.paymentMethodsRepository.save(method);
    }

    async updatePaymentMethod(id: number, method: UpdatePaymentMethodsRequest){
        const paymentMethod = await this.paymentMethodsRepository.findOne({ where: { id: id } });

        if (!paymentMethod) {
            throw new NotFoundException(`Payment Method with id ${id} does not exist`);
        }

        paymentMethod.method_name = method.method_name || paymentMethod.method_name;
        paymentMethod.value = method.value || paymentMethod.value;
        paymentMethod.is_active = method.is_active,

        await this.paymentMethodsRepository.save(paymentMethod);
    }

    async createSocialMedia(socialMedia: CreateSocialMediaRequest) {
        const confilict = await this.socialMediaRepository.findOne({
            where: { url: socialMedia.url }
        })

        if (confilict) {
            throw new BadRequestException('Social Media with this url already exists');
        }

        return this.socialMediaRepository.save(socialMedia);
    }

    async getAllSocialMedia() {
        const socialMedia = await this.socialMediaRepository.find();
        
        if (socialMedia.length === 0) {
            throw new NotFoundException('No Social Media found');
        }

        return socialMedia.sort((a, b) => a.id - b.id);
    }

    async getSocialMediaById(id: number) {
        const socialMedia = await this.socialMediaRepository.findOne({ where: { id: id } });

        if (!socialMedia) {
            throw new NotFoundException(`Social Media with id ${id} does not exist`);
        }

        return socialMedia;
    }

    async updateSocialMedia(id: number, socialMedia: UpdateSocialMediaRequest) {
        const socialMediaEntity = await this.socialMediaRepository.findOne({ where: { id: id } });

        if (!socialMediaEntity) {
            throw new NotFoundException(`Social Media with id ${id} does not exist`);
        }

        socialMediaEntity.name = socialMedia.name || socialMediaEntity.name;
        socialMediaEntity.url = socialMedia.url || socialMediaEntity.url;
        socialMediaEntity.is_active = socialMedia.is_active ;

        await this.socialMediaRepository.save(socialMediaEntity);
    }

    async sendNotificationToSpecificUser(notificationRequest: SendNotificationToSpesificRequest) {
        const user = await this.userRepository.findOne({ where: { id: notificationRequest.user_id } });

        if (!user) {
            throw new NotFoundException(`User with id ${notificationRequest.user_id} does not exist`);
        }

        user.devices.forEach((device) => {
            this.firebaseService.sendNotification(device.device_token, notificationRequest.title, notificationRequest.body);
        });

        return true;
    }

    async sendNotificationToAllUsers(notificationRequest: SendNotificationToAllRequest) {
        const users = await this.userRepository.find();

        users.forEach((user) => {
            user.devices.forEach((device) => {
                this.firebaseService.sendNotification(device.device_token, notificationRequest.title, notificationRequest.body);
            });
        });

        return true;
    }

    
}
