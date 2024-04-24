// Interface representing user profile information
export interface userProfile {
    userID: number; // Unique identifier for the user
    userName: string // User's username or display name
    firstName: string // User's first name
    lastName : string // User's last name
    joinDate: Date // Date when the user joined the platform
}