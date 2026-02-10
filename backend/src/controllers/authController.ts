import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest, ApiResponse } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_EXPIRES_IN = '7d';

// Generate JWT token
const generateToken = (userId: string, email: string): string => {
    return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// POST /auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, name } = req.body;

        // Validation
        if (!email || !password || !name) {
            res.status(400).json({
                success: false,
                error: 'Please provide email, password, and name',
            } as ApiResponse);
            return;
        }

        if (password.length < 8) {
            res.status(400).json({
                success: false,
                error: 'Password must be at least 8 characters long',
            } as ApiResponse);
            return;
        }

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            res.status(409).json({
                success: false,
                error: 'User with this email already exists',
            } as ApiResponse);
            return;
        }

        // Create user (password will be hashed by model hook)
        const user = await User.create({ email, password, name });

        // Generate token
        const token = generateToken(user.id, user.email);

        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                },
                token,
            },
            message: 'User registered successfully',
        } as ApiResponse);
    } catch (error: any) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            error: 'Registration failed',
        } as ApiResponse);
    }
};

// POST /auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            res.status(400).json({
                success: false,
                error: 'Please provide email and password',
            } as ApiResponse);
            return;
        }

        // Find user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            res.status(401).json({
                success: false,
                error: 'Invalid email or password',
            } as ApiResponse);
            return;
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                error: 'Invalid email or password',
            } as ApiResponse);
            return;
        }

        // Generate token
        const token = generateToken(user.id, user.email);

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                },
                token,
            },
            message: 'Login successful',
        } as ApiResponse);
    } catch (error: any) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Login failed',
        } as ApiResponse);
    }
};

// GET /auth/profile
export const getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as unknown as AuthRequest).userId;

        const user = await User.findByPk(userId, {
            attributes: ['id', 'email', 'name', 'createdAt'],
        });

        if (!user) {
            res.status(404).json({
                success: false,
                error: 'User not found',
            } as ApiResponse);
            return;
        }

        res.status(200).json({
            success: true,
            data: user,
        } as ApiResponse);
    } catch (error: any) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch profile',
        } as ApiResponse);
    }
};

