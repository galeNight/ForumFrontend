import { userProfile } from "./userProfile";// Importing the userProfile interface
// Interface representing a user account
export interface userAccount {
    userID: number; // Unique identifier for the user account
    userEmail: string; // Email address associated with the user account
    userPassword: string; // Password associated with the user account
    role: Role; // Role assigned to the user account
    Profile? : userProfile // Optional reference to the user's profile
}
// Enum representing different roles assigned to user accounts
export enum Role {
    Guest = 1, // Role for guest users
    Admin = 2, // Role for administrators
    User = 3 // Role for regular users
}