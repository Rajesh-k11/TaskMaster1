export interface AuthRequest extends Request {
    userId?: string;
}

export interface JWTPayload {
    userId: string;
    email: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}
