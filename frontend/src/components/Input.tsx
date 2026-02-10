import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label className="text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <input
                className={`px-4 py-3 border border-gray-300 rounded-xl text-base transition-all duration-200 bg-white
                    ${error
                        ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                        : 'focus:border-primary focus:ring-4 focus:ring-primary/10'
                    } 
                    focus:outline-none hover:border-gray-400 ${className}`}
                {...props}
            />
            {error && (
                <span className="text-xs text-red-600 font-medium">{error}</span>
            )}
        </div>
    );
};

export default Input;
