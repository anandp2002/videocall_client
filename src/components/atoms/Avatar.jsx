/**
 * Avatar Component (Atom)
 * Displays user initials or icon when video is disabled
 */
import React from 'react'
import { User } from 'lucide-react';

export default function Avatar({ name = '', size = 'medium' }) {
    const sizeClasses = {
        small: 'w-12 h-12 text-sm',
        medium: 'w-24 h-24 text-2xl',
        large: 'w-32 h-32 text-4xl',
    };

    const getInitials = (name) => {
        if (!name) return '';
        const parts = name.trim().split(' ');
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    const initials = getInitials(name);

    return (
        <div
            className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-semibold text-white shadow-2xl shadow-blue-500/50 ring-4 ring-white/10`}
        >
            {initials || <User className="w-1/2 h-1/2" />}
        </div>
    );
}
