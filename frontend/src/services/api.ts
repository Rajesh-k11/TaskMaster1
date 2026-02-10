import axios, { AxiosInstance } from 'axios';
import {
    LoginCredentials,
    RegisterCredentials,
    AuthResponse,
    User,
    TasksResponse,
    TaskResponse,
    CreateTaskData,
    UpdateTaskData,
} from '../types';

const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: API_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor to add token
        this.api.interceptors.request.use((config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        // Response interceptor for error handling
        this.api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    // Token expired or invalid
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }

    // Auth APIs
    async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        const response = await this.api.post<AuthResponse>('/auth/register', credentials);
        return response.data;
    }

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await this.api.post<AuthResponse>('/auth/login', credentials);
        return response.data;
    }

    async getProfile(): Promise<{ success: boolean; data: User }> {
        const response = await this.api.get('/auth/profile');
        return response.data;
    }

    // Task APIs
    async getTasks(filters?: { status?: string; search?: string }): Promise<TasksResponse> {
        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);
        if (filters?.search) params.append('search', filters.search);

        const response = await this.api.get<TasksResponse>(`/tasks?${params.toString()}`);
        return response.data;
    }

    async getTaskById(id: string): Promise<TaskResponse> {
        const response = await this.api.get<TaskResponse>(`/tasks/${id}`);
        return response.data;
    }

    async createTask(data: CreateTaskData): Promise<TaskResponse> {
        const response = await this.api.post<TaskResponse>('/tasks', data);
        return response.data;
    }

    async updateTask(id: string, data: UpdateTaskData): Promise<TaskResponse> {
        const response = await this.api.put<TaskResponse>(`/tasks/${id}`, data);
        return response.data;
    }

    async deleteTask(id: string): Promise<{ success: boolean; message: string }> {
        const response = await this.api.delete(`/tasks/${id}`);
        return response.data;
    }
}

export default new ApiService();
