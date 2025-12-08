/**
 * NoteEditor Component (Organism)
 * Collaborative rich text editor using Tiptap and Y.js
 */
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import Placeholder from '@tiptap/extension-placeholder';
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Code,
    Undo,
    Redo,
    Users,
} from 'lucide-react';
import useCollaborativeNotes from '../../hooks/useCollaborativeNotes';

export default function NoteEditor({ roomId, className = '' }) {
    const { ydoc, isConnected, connectedUsers } = useCollaborativeNotes(roomId);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                // Disable history since Y.js handles it
                history: false,
            }),
            Collaboration.configure({
                document: ydoc,
            }),
            Placeholder.configure({
                placeholder: 'Start taking notes...',
            }),
        ],
        editorProps: {
            attributes: {
                class:
                    'prose prose-invert max-w-none focus:outline-none min-h-[400px] px-4 py-3',
            },
        },
    });

    if (!editor) {
        return (
            <div className={`flex items-center justify-center h-full ${className}`}>
                <div className="text-gray-400">Loading editor...</div>
            </div>
        );
    }

    const ToolbarButton = ({ onClick, active, icon: Icon, title }) => (
        <button
            onClick={onClick}
            className={`p-2 rounded hover:bg-slate-700 transition-colors ${active ? 'bg-slate-700 text-blue-400' : 'text-gray-300'
                }`}
            title={title}
            type="button"
        >
            <Icon className="w-4 h-4" />
        </button>
    );

    return (
        <div className={`flex flex-col h-full bg-slate-900 rounded-lg border border-slate-700 ${className}`}>
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700 bg-slate-800/50">
                <div className="flex items-center gap-1">
                    {/* Text formatting */}
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        active={editor.isActive('bold')}
                        icon={Bold}
                        title="Bold"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        active={editor.isActive('italic')}
                        icon={Italic}
                        title="Italic"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        active={editor.isActive('code')}
                        icon={Code}
                        title="Code"
                    />

                    <div className="w-px h-6 bg-slate-600 mx-2" />

                    {/* Headings */}
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        active={editor.isActive('heading', { level: 1 })}
                        icon={Heading1}
                        title="Heading 1"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        active={editor.isActive('heading', { level: 2 })}
                        icon={Heading2}
                        title="Heading 2"
                    />

                    <div className="w-px h-6 bg-slate-600 mx-2" />

                    {/* Lists */}
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        active={editor.isActive('bulletList')}
                        icon={List}
                        title="Bullet List"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        active={editor.isActive('orderedList')}
                        icon={ListOrdered}
                        title="Numbered List"
                    />

                    <div className="w-px h-6 bg-slate-600 mx-2" />

                    {/* History */}
                    <ToolbarButton
                        onClick={() => editor.chain().focus().undo().run()}
                        active={false}
                        icon={Undo}
                        title="Undo"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().redo().run()}
                        active={false}
                        icon={Redo}
                        title="Redo"
                    />
                </div>

                {/* Connection status */}
                <div className="flex items-center gap-3">
                    {connectedUsers.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Users className="w-4 h-4" />
                            <span>{connectedUsers.length} online</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <div
                            className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                                }`}
                        />
                        <span className="text-xs text-gray-400">
                            {isConnected ? 'Connected' : 'Disconnected'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Editor content */}
            <div className="flex-1 overflow-y-auto">
                <EditorContent editor={editor} className="h-full" />
            </div>
        </div>
    );
}
