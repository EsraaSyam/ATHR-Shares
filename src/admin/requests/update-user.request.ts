import { IsEmail, IsOptional, IsString } from "class-validator";

export class AdminUpdateUserRequest {
    @IsString()
    @IsOptional()
    full_name: string;

    @IsString()
    @IsOptional()
    phone_number: string;

    @IsString()
    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    is_completed: boolean;

    @IsOptional()
    is_verified: boolean;
}