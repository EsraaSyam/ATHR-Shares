import { IsEmail, IsNotEmpty, IsOptional, MaxLength, MinLength } from "class-validator";

export class CreateUserRequest {
    @IsNotEmpty( { message: 'Full name is required' })
    full_name: string;

    @IsNotEmpty( { message: 'Phone number is required' })
    phone_number: string;

    @IsNotEmpty( { message: 'Password is required' })
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    @MaxLength(50, { message: 'Password must be at most 50 characters' })
    password: string;

    @IsNotEmpty( { message: 'Email is required' })
    @IsEmail( {}, { message: 'Invalid email' })
    email: string;

    @IsOptional()
    id_photo?: string;

    @IsOptional()
    passport_photo?: string;

    @IsOptional()
    is_active?: boolean = true;
}