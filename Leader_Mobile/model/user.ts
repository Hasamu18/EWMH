import { aparmentArea } from "./aparmentArea";

export interface User {
    user:{
        accountId: string;
        email: string;
        fullName: string;
        dateOfBirth: string;
        phoneNumber: string;
        avatarUrl: string;
        role: string;
    }
    apartment: aparmentArea[]

}

