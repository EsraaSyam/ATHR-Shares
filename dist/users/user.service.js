"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("./user.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bycrpt = require("bcrypt");
const not_found_exception_1 = require("../exceptions/not-found.exception");
let UsersService = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async create(createUserRequest) {
        if (!createUserRequest.email || !createUserRequest.password) {
            throw new common_1.BadRequestException('Email and password are required');
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
    async updateById(id, updateUserRequest) {
        if (!Object.keys(updateUserRequest).length) {
            throw new common_1.BadRequestException('At least one field is required to update user');
        }
        const [user, conflictingUsers] = await Promise.all([
            this.usersRepository.findOne({ where: { id } }),
            this.usersRepository.find({
                where: [
                    { email: updateUserRequest.email, id: (0, typeorm_2.Not)(id) },
                ],
            }),
        ]);
        if (!user) {
            throw new not_found_exception_1.NotFoundException(`User of id ${id} does not exist`);
        }
        if (conflictingUsers.length > 0) {
            throw new Error('User with this email already exists');
        }
        const updatedFields = {};
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
    async findByEmail(email) {
        return this.usersRepository.findOne({ where: { email } });
    }
    async findById(id) {
        return this.usersRepository.findOne({ where: { id } });
    }
    async softDeleteById(id) {
        const user = await this.findById(id);
        if (!user) {
            throw new not_found_exception_1.NotFoundException(`User with email ${id} does not exist`);
        }
        user.is_active = false;
        await this.usersRepository.update(id, user);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=user.service.js.map