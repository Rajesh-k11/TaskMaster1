import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Task from '../models/Task';
import { AuthRequest, ApiResponse } from '../types';

// POST /tasks - Create task
export const createTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as unknown as AuthRequest).userId;
        const { title, description, status } = req.body;

        if (!title) {
            res.status(400).json({
                success: false,
                error: 'Title is required',
            } as ApiResponse);
            return;
        }

        const task = await Task.create({
            userId: userId!,
            title,
            description: description || '',
            status: status || 'pending',
        });

        res.status(201).json({
            success: true,
            data: task,
            message: 'Task created successfully',
        } as ApiResponse);
    } catch (error: any) {
        console.error('Create task error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create task',
        } as ApiResponse);
    }
};

// GET /tasks - List user's tasks with filters
export const getTasks = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as unknown as AuthRequest).userId;
        const { status, search } = req.query;

        const whereClause: any = { userId };

        // Filter by status
        if (status && typeof status === 'string') {
            whereClause.status = status;
        }

        // Search in title and description
        if (search && typeof search === 'string') {
            whereClause[Op.or] = [
                { title: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } },
            ];
        }

        const tasks = await Task.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json({
            success: true,
            data: tasks,
        } as ApiResponse);
    } catch (error: any) {
        console.error('Get tasks error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch tasks',
        } as ApiResponse);
    }
};

// GET /tasks/:id - Get single task
export const getTaskById = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as unknown as AuthRequest).userId;
        const { id } = req.params;

        const task = await Task.findOne({
            where: { id, userId },
        });

        if (!task) {
            res.status(404).json({
                success: false,
                error: 'Task not found',
            } as ApiResponse);
            return;
        }

        res.status(200).json({
            success: true,
            data: task,
        } as ApiResponse);
    } catch (error: any) {
        console.error('Get task error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch task',
        } as ApiResponse);
    }
};

// PUT /tasks/:id - Update task
export const updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as unknown as AuthRequest).userId;
        const { id } = req.params;
        const { title, description, status } = req.body;

        const task = await Task.findOne({
            where: { id, userId },
        });

        if (!task) {
            res.status(404).json({
                success: false,
                error: 'Task not found',
            } as ApiResponse);
            return;
        }

        // Update fields
        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (status !== undefined) task.status = status;

        await task.save();

        res.status(200).json({
            success: true,
            data: task,
            message: 'Task updated successfully',
        } as ApiResponse);
    } catch (error: any) {
        console.error('Update task error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update task',
        } as ApiResponse);
    }
};

// DELETE /tasks/:id - Delete task
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as unknown as AuthRequest).userId;
        const { id } = req.params;

        const task = await Task.findOne({
            where: { id, userId },
        });

        if (!task) {
            res.status(404).json({
                success: false,
                error: 'Task not found',
            } as ApiResponse);
            return;
        }

        await task.destroy();

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully',
        } as ApiResponse);
    } catch (error: any) {
        console.error('Delete task error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete task',
        } as ApiResponse);
    }
};

