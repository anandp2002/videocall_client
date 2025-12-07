/**
 * Input Component (Atom)
 * Styled input field with error state and label support
 */
import React from 'react'
export default function Input({
    label,
    error,
    className = '',
    ...props
}) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-200 mb-2">
                    {label}
                </label>
            )}
            <input
                className={`w-full px-4 py-3 bg-slate-800 border ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:ring-blue-500'
                    } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${className}`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-400">{error}</p>
            )}
        </div>
    );
}

