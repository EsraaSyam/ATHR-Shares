import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Res, UnauthorizedException, UseInterceptors } from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserRequest } from './requests/create-user.requests';
import { Response } from 'express';
import { UpdateUserRequest } from './requests/update-user.request';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    async createUser(@Body() createUserRequest: CreateUserRequest, @Res() res: Response) {
        try {
            const user = await this.usersService.create(createUserRequest);
            res.status(201).json(
                {
                    message: 'User created successfully',
                    data: user
                }
            )
        } catch (error) {
            res.status(400).json(
                {
                    message: error.message
                })
        }
    }

    @Get()
    async findAllUsers(@Res() res) {
        const users = await this.usersService.findAll();

        res.status(200).json(
            {
                message: 'Users fetched successfully',
                data: users
            }
        )
    }

    @Put('/:id')
    async updateUser(@Res() res, @Param('id') id: number, @Body() updateUserRequest: UpdateUserRequest) {
        try {
            const user = await this.usersService.updateById(id, updateUserRequest);
            res.status(200).json(
                {
                    message: 'User updated',
                    data: user

                })

        } catch (error) {
            res.status(400).json(
                {
                    message: error.message
                })
        }

    }

    @Delete('/:id')
    async softDeleteUser(@Res() res, @Param('id') id: number) {
        try {
            await this.usersService.softDeleteById(id);
            
            res.status(200).json(
                {
                    message: 'User deleted successfully'
                }
            )
        } catch (error) {
            res.status(400).json(
                {
                    message: error.message
                }
            )
        }
    }

  
}