export class RealtyDetailsResponss {
    id: number;
    title: string;
    bathroom_count: number;
    room_count: number;
    area: number;
    type: string;
    price: number;
    features: string[];
    longitude: string;
    latitude: string;

    constructor(details: any) {
        this.id = details.id;
        this.title = details.title;
        this.bathroom_count = details.bathroom_count;
        this.room_count = details.room_count;
        this.area = details.area;
        this.type = details.type;
        this.price = details.price;
        this.features = details.features; 
        this.longitude = details.longitude;
        this.latitude = details.latitude;
    }
}
