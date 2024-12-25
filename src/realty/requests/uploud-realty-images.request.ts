import { IsOptional } from "class-validator";

export class UploudRealtyImagesRequest {
    @IsOptional()
    images?: string[];
}