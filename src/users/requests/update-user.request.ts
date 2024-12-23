import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class UpdateUserRequest {
    @IsNotEmpty( { message: 'Full name is required' })
    full_name: string;

    @IsNotEmpty( { message: 'Phone number is required' })
    phone_number: string;

    @IsNotEmpty( { message: 'Email is required' })
    @IsEmail( {}, { message: 'Invalid email' })
    email: string;
}