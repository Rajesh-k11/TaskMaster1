import dotenv from 'dotenv';
import { sequelize, connectDatabase } from '../config/database';
import User from '../models/User';
import Task, { TaskStatus } from '../models/Task';

dotenv.config();

const seedDatabase = async (): Promise<void> => {
    try {
        console.log('🌱 Starting database seed...');

        // Connect to database
        await connectDatabase();

        // Create demo user
        const demoUser = await User.create({
            email: 'demo@taskmaster.com',
            password: 'Demo123!',
            name: 'Demo User',
        });

        console.log('✅ Demo user created:', demoUser.email);

        // Create sample tasks
        const sampleTasks = [
            {
                userId: demoUser.id,
                title: 'Complete project documentation',
                description: 'Write comprehensive README and API docs for the project',
                status: TaskStatus.COMPLETED,
            },
            {
                userId: demoUser.id,
                title: 'Review code and refactor',
                description: 'Go through codebase and improve code quality',
                status: TaskStatus.IN_PROGRESS,
            },
            {
                userId: demoUser.id,
                title: 'Deploy to production',
                description: 'Deploy frontend and backend to Render',
                status: TaskStatus.PENDING,
            },
            {
                userId: demoUser.id,
                title: 'Write unit tests',
                description: 'Add test coverage for all API endpoints',
                status: TaskStatus.PENDING,
            },
            {
                userId: demoUser.id,
                title: 'Setup CI/CD pipeline',
                description: 'Configure automated deployment and testing',
                status: TaskStatus.PENDING,
            },
        ];

        await Task.bulkCreate(sampleTasks);

        console.log('✅ Sample tasks created:', sampleTasks.length);
        console.log('');
        console.log('🎉 Database seeded successfully!');
        console.log('');
        console.log('Demo credentials:');
        console.log('Email: demo@taskmaster.com');
        console.log('Password: Demo123!');

        await sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    }
};

seedDatabase();
