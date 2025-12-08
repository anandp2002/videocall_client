/**
 * FloatingNotePanel Component (Organism)
 * Draggable and resizable floating panel for the note editor
 */
import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { Minimize2, Maximize2, X } from 'lucide-react';
import NoteEditor from './NoteEditor';

export default function FloatingNotePanel({ roomId, onClose }) {
    const [isMinimized, setIsMinimized] = useState(false);
    const [size, setSize] = useState({ width: 600, height: 500 });

    const handleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    return (
        <Draggable
            handle=".drag-handle"
            bounds="parent"
            defaultPosition={{ x: 100, y: 100 }}
        >
            <div
                className="fixed z-50 bg-slate-900 rounded-lg shadow-2xl border-2 border-slate-600"
                style={{
                    width: isMinimized ? '300px' : `${size.width}px`,
                    height: isMinimized ? '50px' : `${size.height}px`,
                }}
            >
                {/* Header */}
                <div className="drag-handle flex items-center justify-between px-4 py-2 bg-slate-800 rounded-t-lg border-b border-slate-700 cursor-move">
                    <h3 className="text-sm font-semibold text-white">Notes</h3>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleMinimize}
                            className="p-1 hover:bg-slate-700 rounded transition-colors"
                            title={isMinimized ? 'Maximize' : 'Minimize'}
                        >
                            {isMinimized ? (
                                <Maximize2 className="w-4 h-4 text-gray-400" />
                            ) : (
                                <Minimize2 className="w-4 h-4 text-gray-400" />
                            )}
                        </button>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-red-600 rounded transition-colors"
                            title="Close"
                        >
                            <X className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                {!isMinimized && (
                    <div className="h-[calc(100%-50px)] p-2">
                        <NoteEditor roomId={roomId} className="h-full" />
                    </div>
                )}

                {/* Resize handle (bottom-right corner) */}
                {!isMinimized && (
                    <div
                        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            const startX = e.clientX;
                            const startY = e.clientY;
                            const startWidth = size.width;
                            const startHeight = size.height;

                            const handleMouseMove = (moveEvent) => {
                                const newWidth = Math.max(400, startWidth + (moveEvent.clientX - startX));
                                const newHeight = Math.max(300, startHeight + (moveEvent.clientY - startY));
                                setSize({ width: newWidth, height: newHeight });
                            };

                            const handleMouseUp = () => {
                                document.removeEventListener('mousemove', handleMouseMove);
                                document.removeEventListener('mouseup', handleMouseUp);
                            };

                            document.addEventListener('mousemove', handleMouseMove);
                            document.addEventListener('mouseup', handleMouseUp);
                        }}
                    >
                        <div className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-slate-500" />
                    </div>
                )}
            </div>
        </Draggable>
    );
}
