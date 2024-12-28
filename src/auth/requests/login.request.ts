import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginRequest {
    @IsNotEmpty({message: "رقم الموبايل مطلوب"})
    phone_number: string

    @IsNotEmpty({message: "الباسورد مطلوب"})
    password: string;
}