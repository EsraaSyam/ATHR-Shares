import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class ResetPasswordRequest {
    @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
    email: string;

    @IsNotEmpty({ message: 'كلمة المرور الجديدة مطلوبة' })
    @MinLength(6, { message: 'يجب أن تكون كلمة المرور على الأقل 6 أحرف' })
    @MaxLength(50, { message: 'يجب ألا تزيد كلمة المرور عن 50 حرفًا' })
    newPassword: string;

    @IsNotEmpty({ message: 'تأكيد كلمة المرور مطلوب' })
    @MinLength(6, { message: 'يجب أن تكون كلمة المرور على الأقل 6 أحرف' })
    @MaxLength(50, { message: 'يجب ألا تزيد كلمة المرور عن 50 حرفًا' })
    confirmPassword: string;
}