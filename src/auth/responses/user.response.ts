export class User {
    id: number;
    full_name: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    is_completed: boolean;
    profile_photo: string;
    

    constructor(user: any) {
        this.id = user.id;
        this.full_name = user.full_name;
        const nameParts = user.full_name.split(' ');
        this.first_name = nameParts[0];
        this.last_name = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
        this.email = user.email;
        this.phone_number = user.phone_number;
        this.is_completed = user.is_completed;
        this.profile_photo = user.profile_photo;

    }
}