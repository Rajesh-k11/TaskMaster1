import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2, CheckCircle2, Clock, ListTodo } from 'lucide-react';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Button from '../components/Button';
import api from '../services/api';
import { Task, User } from '../types';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    // Form states
    const [formData, setFormData] = useState({ title: '', description: '', status: 'pending' as Task['status'] });
    const [formError, setFormError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!token || !storedUser) {
            navigate('/login');
            return;
        }

        setUser(JSON.parse(storedUser));
        fetchTasks();
    }, [navigate]);

    useEffect(() => {
        applyFilters();
    }, [tasks, filter, searchQuery]);

    const fetchTasks = async () => {
        try {
            setIsLoading(true);
            const response = await api.getTasks();
            if (response.success) {
                setTasks(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...tasks];

        // Apply status filter
        if (filter !== 'all') {
            filtered = filtered.filter(task => task.status === filter);
        }

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(task =>
                task.title.toLowerCase().includes(query) ||
                task.description.toLowerCase().includes(query)
            );
        }

        setFilteredTasks(filtered);
    };

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');

        if (!formData.title.trim()) {
            setFormError('Title is required');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await api.createTask(formData);
            if (response.success) {
                setTasks([response.data, ...tasks]);
                setIsCreateModalOpen(false);
                setFormData({ title: '', description: '', status: 'pending' });
            }
        } catch (error: any) {
            setFormError(error.response?.data?.error || 'Failed to create task');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTask) return;
        setFormError('');

        if (!formData.title.trim()) {
            setFormError('Title is required');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await api.updateTask(selectedTask.id, formData);
            if (response.success) {
                setTasks(tasks.map(t => t.id === selectedTask.id ? response.data : t));
                setIsEditModalOpen(false);
                setSelectedTask(null);
                setFormData({ title: '', description: '', status: 'pending' });
            }
        } catch (error: any) {
            setFormError(error.response?.data?.error || 'Failed to update task');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteTask = async () => {
        if (!selectedTask) return;

        setIsSubmitting(true);
        try {
            await api.deleteTask(selectedTask.id);
            setTasks(tasks.filter(t => t.id !== selectedTask.id));
            setIsDeleteModalOpen(false);
            setSelectedTask(null);
        } catch (error) {
            console.error('Failed to delete task:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const openEditModal = (task: Task) => {
        setSelectedTask(task);
        setFormData({ title: task.title, description: task.description, status: task.status });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (task: Task) => {
        setSelectedTask(task);
        setIsDeleteModalOpen(true);
    };

    const getStatusIcon = (status: Task['status']) => {
        switch (status) {
            case 'completed':
                return <CheckCircle2 size={20} className="text-green-500" />;
            case 'in-progress':
                return <Clock size={20} className="text-yellow-500" />;
            default:
                return <ListTodo size={20} className="text-gray-400" />;
        }
    };

    const getStatusBadge = (status: Task['status']) => {
        const styles = {
            pending: 'bg-gray-100 text-gray-700',
            'in-progress': 'bg-yellow-100 text-yellow-700',
            completed: 'bg-green-100 text-green-700',
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
                {status.replace('-', ' ').toUpperCase()}
            </span>
        );
    };

    const stats = {
        total: tasks.length,
        pending: tasks.filter(t => t.status === 'pending').length,
        inProgress: tasks.filter(t => t.status === 'in-progress').length,
        completed: tasks.filter(t => t.status === 'completed').length,
    };


    return (
        <div className="min-h-screen pb-8 bg-slate-50">
            <Navbar user={user} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36">
                {/* Stats Cards - Clean shadcn-style minimal design */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* Total Tasks */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
                        <p className="text-sm font-medium text-gray-600 mb-2">Total Tasks</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                    </div>

                    {/* Pending */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
                        <p className="text-sm font-medium text-gray-600 mb-2">Pending</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
                    </div>

                    {/* In Progress */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
                        <p className="text-sm font-medium text-gray-600 mb-2">In Progress</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.inProgress}</p>
                    </div>

                    {/* Completed */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
                        <p className="text-sm font-medium text-gray-600 mb-2">Completed</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search tasks by title or description..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="px-4 py-2.5 pl-10 border border-gray-300 rounded-md w-full focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all text-sm"
                            />
                        </div>


                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="px-3 py-2.5 border border-gray-300 rounded-md md:w-48 cursor-pointer focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all text-sm font-medium bg-white"
                        >
                            <option value="all">All Tasks</option>
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>

                        <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
                            <Plus size={18} className="inline mr-1.5" />
                            New Task
                        </Button>
                    </div>
                </div>

                {/* Tasks Grid */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
                    </div>
                ) : filteredTasks.length === 0 ? (
                    <div className="text-center py-20">
                        <ListTodo size={64} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No tasks found</h3>
                        <p className="text-gray-500">
                            {searchQuery || filter !== 'all' ? 'Try adjusting your filters' : 'Create your first task to get started!'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTasks.map((task) => (
                            <div key={task.id} className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="flex-shrink-0">
                                            {getStatusIcon(task.status)}
                                        </div>
                                        <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{task.title}</h3>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0 ml-2">
                                        <button
                                            onClick={() => openEditModal(task)}
                                            className="p-2 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                                        >
                                            <Pencil size={16} className="text-blue-600" />
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(task)}
                                            className="p-2 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                                        >
                                            <Trash2 size={16} className="text-red-600" />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-gray-600 mb-5 line-clamp-2 text-sm leading-relaxed">
                                    {task.description || 'No description provided'}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    {getStatusBadge(task.status)}
                                    <span className="text-xs text-gray-500 font-medium">
                                        {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Task Modal */}
            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Task">
                <form onSubmit={handleCreateTask} className="space-y-4">
                    {formError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {formError}
                        </div>
                    )}

                    <Input
                        label="Title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Enter task title"
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Enter task description (optional)"
                            className="input-field w-full min-h-[100px]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as Task['status'] })}
                            className="input-field w-full cursor-pointer"
                        >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <div className="flex gap-3">
                        <Button type="button" variant="secondary" onClick={() => setIsCreateModalOpen(false)} className="flex-1">
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" isLoading={isSubmitting} className="flex-1">
                            Create Task
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Edit Task Modal */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Task">
                <form onSubmit={handleEditTask} className="space-y-4">
                    {formError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {formError}
                        </div>
                    )}

                    <Input
                        label="Title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Enter task title"
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Enter task description (optional)"
                            className="input-field w-full min-h-[100px]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as Task['status'] })}
                            className="input-field w-full cursor-pointer"
                        >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <div className="flex gap-3">
                        <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)} className="flex-1">
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" isLoading={isSubmitting} className="flex-1">
                            Update Task
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Task">
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Are you sure you want to delete "{selectedTask?.title}"? This action cannot be undone.
                    </p>
                    <div className="flex gap-3">
                        <Button type="button" variant="secondary" onClick={() => setIsDeleteModalOpen(false)} className="flex-1">
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDeleteTask} isLoading={isSubmitting} className="flex-1">
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Dashboard;
