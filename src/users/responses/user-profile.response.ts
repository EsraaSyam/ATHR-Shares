export class UserProfileResponse {
    full_name: string;

    phone_number: string;

    email: string;

    constructor(user: any) {
        this.full_name = user.full_name;
        this.email = user.email;
        this.phone_number = user.phone_number;
    }
}