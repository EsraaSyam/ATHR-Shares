import { IsNotEmpty } from "class-validator";

export class CheakCodeRequest {
    @IsNotEmpty({ message: 'الكود مطلوب' })
    resetCode: string;

    @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
    email: string;
}