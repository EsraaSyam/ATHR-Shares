import { IsEmail, IsNotEmpty } from "class-validator";

export class ForgetPasswordRequest {
    @IsNotEmpty({message: "الايميل مطلوب"})
    email: string;
}