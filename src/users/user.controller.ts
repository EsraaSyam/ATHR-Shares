import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Req, Res, UnauthorizedException, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserRequest } from './requests/create-user.requests';
import { Response } from 'express';
import { UpdateUserRequest } from './requests/update-user.request';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { AuthService } from 'src/auth/auth.service';
import { UpdateProfileRequest } from './requests/update-profile.request';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
    ) { }

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

    @Put('/update-user/:id')
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

    @Get('get-by-id/:id')
    async findUserById(@Res() res, @Param('id', ParseIntPipe) id: number) {
        try {
            const user = await this.usersService.findById(id);

            if (!user) {
                throw new NotFoundException('User not found');
            }

            res.status(200).json(
                {
                    message: 'User fetched successfully',
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

    @Get('/profile-data')
    @UseInterceptors(AnyFilesInterceptor())
    async getProfileData(@Body() body, @Req() req, @Res() res: Response) {
        const token = req.headers['authorization'];

        if (!token) {
            throw new UnauthorizedException('Token not provided');
        }

        const user = await this.authService.getUserByToken(token);

        if (!user) {
            throw new UnauthorizedException('User not found');
        }


        const profileData = await this.usersService.getProfileData(user.id);

        res.status(200).json(
            {
                message: 'Profile data fetched successfully',
                data: profileData
            }
        )
    }

    @Put('/update-profile')
    @UseInterceptors(AnyFilesInterceptor())
    async updateProfile(@Body(new ValidationPipe()) updateProfileRequest: UpdateProfileRequest, @Req() req, @Res() res: Response) {
        const token = req.headers['authorization'];

        if (!token) {
            throw new UnauthorizedException('Token not provided');
        }

        let user;

        try {
            user = await this.authService.getUserByToken(token);
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }

        console.log('user', user);

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const updatedUser = await this.usersService.updateProfile(user.id, updateProfileRequest);

        res.status(200).json({
            message: 'Profile updated successfully',
            data: updatedUser,
        });
    }


}