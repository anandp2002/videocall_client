/**
 * FloatingNotePanel Component (Organism)
 * Draggable and resizable floating panel using react-rnd
 */
import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import { Minimize2, Maximize2, X } from 'lucide-react';
import NoteEditor from './NoteEditor';

export default function FloatingNotePanel({ roomId, onClose }) {
    const [isMinimized, setIsMinimized] = useState(false);
    const [size, setSize] = useState({ width: 600, height: 500 });
    const [position, setPosition] = useState({ x: 100, y: 100 });

    const handleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    return (
        <Rnd
            size={isMinimized ? { width: 300, height: 50 } : size}
            position={position}
            onDragStop={(e, d) => {
                setPosition({ x: d.x, y: d.y });
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
                setSize({
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                });
                setPosition(position);
            }}
            minWidth={300}
            minHeight={isMinimized ? 50 : 300}
            bounds="window"
            dragHandleClassName="drag-handle"
            enableResizing={!isMinimized}
            className="z-50"
            style={{
                zIndex: 50,
            }}
        >
            <div className="w-full h-full bg-slate-900 rounded-lg shadow-2xl border-2 border-slate-600 flex flex-col">
                {/* Header */}
                <div className="drag-handle flex items-center justify-between px-4 py-2 bg-slate-800 rounded-t-lg border-b border-slate-700 cursor-move flex-shrink-0">
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
                    <div className="flex-1 p-2 overflow-hidden">
                        <NoteEditor roomId={roomId} className="h-full" />
                    </div>
                )}
            </div>
        </Rnd>
    );
}
