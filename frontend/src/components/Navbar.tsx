import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon } from 'lucide-react';

interface NavbarProps {
    user?: { name: string; email: string } | null;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="fixed top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 bg-white/90 backdrop-blur-xl rounded-2xl px-4 sm:px-8 py-4 sm:py-5 z-50 shadow-lg border border-gray-200/50">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-base sm:text-lg">T</span>
                    </div>
                    <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        TaskMaster
                    </span>
                </Link>

                {user && (
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <UserIcon size={18} className="text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold text-gray-900 text-sm">{user.name}</span>
                                <span className="text-xs text-gray-600">{user.email}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-xl transition-all cursor-pointer font-medium"
                        >
                            <LogOut size={16} className="sm:hidden" />
                            <LogOut size={18} className="hidden sm:block" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
