export interface User {
    id: number;
    email: string;
    createdAt: string;
    updatedAt: string;
    cats: any[];
}

export interface AuthResponse {
    access_token: string;
    user: User;
}

export interface AuthPayload {
  email: string;
  password: string;
}