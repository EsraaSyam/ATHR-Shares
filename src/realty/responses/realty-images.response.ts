
export class RealtyImagesResponse {
    id: number;
    image_url: string;

    constructor(images: any) {
        this.id = images.id;
        this.image_url = images.image_url;
    }
}