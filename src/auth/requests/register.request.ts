import { IsArray, IsEmail, IsNotEmpty, IsOptional, Length, Matches, MaxLength, MinLength, ValidateNested } from "class-validator";
import { Role } from "src/users/enums/user.enum";

export class RegisterRequest {
    @IsNotEmpty({ message: 'الاسم الكامل مطلوب' })
    full_name: string;

    @IsNotEmpty({ message: 'رقم الهاتف مطلوب' })
    @Matches(/^\+?[1-9]\d{6,14}$/, { 
        message: '+رقم الهاتف غير صالح. يجب أن يكون بصيغة دولية صحيحة، مثل: 201012345678' 
      })
    phone_number: string;

    @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
    @MinLength(6, { message: 'يجب أن تكون كلمة المرور على الأقل 6 أحرف' })
    @MaxLength(50, { message: 'يجب ألا تزيد كلمة المرور عن 50 حرفًا' })
    password: string;

    @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
    @IsEmail({}, { message: 'البريد الإلكتروني غير صالح' })
    email: string;

    @IsOptional()
    id_photo_front?: string;

    @IsOptional()
    id_photo_back?: string;

    @IsOptional()
    passport_photo?: string;

    @IsOptional()
    is_active?: boolean = true;

    @IsOptional()
    role?: Role = Role.USER;

    @IsOptional()
    is_verified?: boolean = false;

    @IsOptional()
    is_completed?: boolean = false;

    @IsOptional()
    profile_photo?: string;
}
