/**
 * IconButton Component (Atom)
 * Circular icon-only button for controls
 */
import React from 'react'

export default function IconButton({
    icon: Icon,
    onClick,
    active = false,
    danger = false,
    disabled = false,
    tooltip,
    className = '',
    ...props
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            title={tooltip}
            className={`
        relative group
        w-14 h-14 rounded-full
        flex items-center justify-center
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900
        disabled:opacity-50 disabled:cursor-not-allowed
        ${danger
                    ? 'bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:ring-red-500 shadow-lg hover:shadow-xl hover:shadow-red-500/50 transform hover:scale-110'
                    : active
                        ? 'bg-slate-600 hover:bg-slate-500 focus:ring-slate-400 shadow-md'
                        : 'bg-slate-700 hover:bg-slate-600 focus:ring-slate-500 shadow-md hover:shadow-lg border border-slate-600'
                }
        ${className}
      `}
            {...props}
        >
            <Icon className="w-6 h-6 text-white" />
            {tooltip && (
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-slate-600">
                    {tooltip}
                </span>
            )}
        </button>
    );
}

