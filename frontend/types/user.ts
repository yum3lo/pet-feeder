export interface User {
    id: number;
    email: string;
    createdAt: string;
    updatedAt: string;
    pets: any[];
}

export interface AuthResponse {
    accessToken: string;
    user: User;
}

export interface AuthPayload {
  email: string;
  password: string;
}