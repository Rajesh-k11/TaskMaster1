import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL || 'sqlite:./database.sqlite';
const isProduction = process.env.NODE_ENV === 'production';

// Initialize Sequelize with dynamic database configuration
export const sequelize = new Sequelize(DATABASE_URL, {
    dialect: DATABASE_URL.startsWith('postgres') ? 'postgres' : 'sqlite',
    storage: DATABASE_URL.startsWith('sqlite') ? DATABASE_URL.replace('sqlite:', '') : undefined,
    logging: isProduction ? false : console.log,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    dialectOptions: DATABASE_URL.startsWith('postgres') && isProduction
        ? {
            ssl: {
                require: true,
                rejectUnauthorized: false, // Required for Render PostgreSQL
            },
        }
        : undefined,
});

// Test database connection
export const connectDatabase = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully');

        // Sync models (create tables if they don't exist)
        await sequelize.sync({ alter: !isProduction });
        console.log('✅ Database synchronized');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
};
