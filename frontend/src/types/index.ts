export interface User {
    id: string;
    email: string;
    name: string;
    createdAt?: string;
}

export interface AuthResponse {
    success: boolean;
    data: {
        user: User;
        token: string;
    };
    message?: string;
}

export interface Task {
    id: string;
    userId: string;
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
    createdAt: string;
    updatedAt: string;
}

export interface TasksResponse {
    success: boolean;
    data: Task[];
}

export interface TaskResponse {
    success: boolean;
    data: Task;
    message?: string;
}

export interface ApiError {
    success: false;
    error: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
    name: string;
}

export interface CreateTaskData {
    title: string;
    description?: string;
    status?: 'pending' | 'in-progress' | 'completed';
}

export interface UpdateTaskData {
    title?: string;
    description?: string;
    status?: 'pending' | 'in-progress' | 'completed';
}
