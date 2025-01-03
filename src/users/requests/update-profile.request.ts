import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UpdateProfileRequest {
    @IsString()
    @IsNotEmpty()
    full_name: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    phone_number: string;
}