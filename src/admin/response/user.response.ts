import { AdminEntity } from "../../auth/entities/admin.entity";

export class UserResponse {
    id: number;
    email: string;
    full_name: string;
    phone_number: string;
    is_completed: boolean;
    is_verified: boolean;

    constructor(user: any) {
        this.id = user.id;
        this.email = user.email;
        this.full_name = user.name;
        this.phone_number = user.phone_number;
        this.is_completed = user.is_completed;
        this.is_verified = user.is_verified;
    }

}