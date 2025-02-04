import { IsBoolean, IsString } from "class-validator";

export class CreateSocialMediaRequest {
    @IsString()
    name: string;

    @IsString()
    url: string;
}