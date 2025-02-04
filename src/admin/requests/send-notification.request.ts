import { IsNotEmpty, IsString } from "class-validator";

export class SendNotificationToSpesificRequest {
    @IsNotEmpty()
    user_id: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    body: string;
}

export class SendNotificationToAllRequest {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    body: string;
}