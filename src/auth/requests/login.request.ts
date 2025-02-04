import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginRequest {
    @IsNotEmpty({message: "رقم الموبايل مطلوب"})
    phone_number: string

    @IsNotEmpty({message: "الباسورد مطلوب"})
    password: string;

    @IsNotEmpty({message: "الجهاز مطلوب"})
    device_token: string; 

    @IsNotEmpty({message: "نوع الجهاز مطلوب"})
    device_type: string;
}