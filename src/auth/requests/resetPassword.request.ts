import { IsNotEmpty } from "class-validator";

export class ResetPasswordRequest {
    @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
    email: string;

    @IsNotEmpty({ message: 'كلمة المرور الجديدة مطلوبة' })
    newPassword: string;

    @IsNotEmpty({ message: 'تأكيد كلمة المرور مطلوب' })
    confirmPassword: string;
}