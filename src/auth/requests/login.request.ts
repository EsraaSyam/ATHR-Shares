import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginRequest {
    @IsEmail({}, {message: "الايميل غير صحيح"})
    @IsNotEmpty({message: "الايميل مطلوب"})
    email: string;

    @IsNotEmpty({message: "الباسورد مطلوب"})
    password: string;
}