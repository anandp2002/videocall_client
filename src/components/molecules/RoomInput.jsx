/**
 * RoomInput Component (Molecule)
 * Room ID input with validation and copy functionality
 */
import React from 'react'
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import Input from '../atoms/Input';

export default function RoomInput({
    value,
    onChange,
    error,
    readOnly = false,
    showCopy = false,
    label,
}) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const formatRoomId = (val) => {
        // Only allow numbers and limit to 6 digits
        const numbers = val.replace(/\D/g, '').slice(0, 6);
        return numbers;
    };

    const handleChange = (e) => {
        if (!readOnly) {
            const formatted = formatRoomId(e.target.value);
            onChange(formatted);
        }
    };

    return (
        <div className="relative">
            <Input
                label={label}
                value={value}
                onChange={handleChange}
                error={error}
                readOnly={readOnly}
                placeholder="Enter 6-digit room ID"
                maxLength={6}
                className={showCopy ? 'pr-12' : ''}
            />
            {showCopy && value && (
                <button
                    onClick={handleCopy}
                    className="absolute right-3 top-[38px] p-2 hover:bg-dark-700 rounded-lg transition-colors"
                    title="Copy room ID"
                >
                    {copied ? (
                        <Check className="w-5 h-5 text-green-500" />
                    ) : (
                        <Copy className="w-5 h-5 text-gray-400" />
                    )}
                </button>
            )}
        </div>
    );
}
