import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RegisterAdminRequest {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsString()
    @IsOptional()
    profile_image: string;
}