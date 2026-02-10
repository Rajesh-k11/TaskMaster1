import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export enum TaskStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in-progress',
    COMPLETED = 'completed',
}

interface TaskAttributes {
    id: string;
    userId: string;
    title: string;
    description: string;
    status: TaskStatus;
    createdAt?: Date;
    updatedAt?: Date;
}

interface TaskCreationAttributes extends Optional<TaskAttributes, 'id' | 'description' | 'status'> { }

class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
    public id!: string;
    public userId!: string;
    public title!: string;
    public description!: string;
    public status!: TaskStatus;
    public createdAt!: Date;
    public updatedAt!: Date;
}

Task.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: '',
        },
        status: {
            type: DataTypes.ENUM(...Object.values(TaskStatus)),
            allowNull: false,
            defaultValue: TaskStatus.PENDING,
        },
    },
    {
        sequelize,
        tableName: 'tasks',
        timestamps: true,
    }
);

export default Task;
