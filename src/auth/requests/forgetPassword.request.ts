import { IsEmail, IsNotEmpty } from "class-validator";

export class ForgetPasswordRequest {
    @IsNotEmpty({message: "الايميل مطلوب"})
    @IsEmail({}, {message: "الايميل غير صالح"})
    email: string;
}