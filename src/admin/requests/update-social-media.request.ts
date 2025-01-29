import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateSocialMediaRequest {
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    url: string;

    @IsBoolean()
    @IsOptional()  
    is_active: boolean;
}