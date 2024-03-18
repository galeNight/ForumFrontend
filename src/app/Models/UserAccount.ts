import { userProfile } from "./userProfile";

export interface userAccount {
    userID: number;
    userEmail: string;
    userPassword: string;
    role: Role;
    Profile? : userProfile // Optional
}

export enum Role {
    Guest = 1,
    Admin = 2,
    User = 3
}