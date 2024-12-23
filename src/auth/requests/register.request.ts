import { IsEmail, IsNotEmpty, IsOptional, MaxLength, MinLength } from "class-validator";

export class RegisterRequest {
    @IsNotEmpty({ message: 'الاسم الكامل مطلوب' })
    full_name: string;

    @IsNotEmpty({ message: 'رقم الهاتف مطلوب' })
    phone_number: string;

    @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
    @MinLength(6, { message: 'يجب أن تكون كلمة المرور على الأقل 6 أحرف' })
    @MaxLength(50, { message: 'يجب ألا تزيد كلمة المرور عن 50 حرفًا' })
    password: string;

    @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
    @IsEmail({}, { message: 'البريد الإلكتروني غير صالح' })
    email: string;

    @IsOptional()
    id_photo?: string;

    @IsOptional()
    passport_photo?: string;

    @IsOptional()
    is_active?: boolean = true;
}
