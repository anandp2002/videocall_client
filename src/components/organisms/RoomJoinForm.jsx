/**
 * RoomJoinForm Component (Organism)
 * Room creation and joining interface
 */
import React from 'react'
import { useState } from 'react';
import { Plus, LogIn } from 'lucide-react';
import Button from '../atoms/Button';
import RoomInput from '../molecules/RoomInput';

export default function RoomJoinForm({ onCreateRoom, onJoinRoom, error: externalError }) {
    const [roomId, setRoomId] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreateRoom = async () => {
        setLoading(true);
        setError('');
        try {
            await onCreateRoom();
        } catch (err) {
            setError(err.message || 'Failed to create room');
        } finally {
            setLoading(false);
        }
    };

    const handleJoinRoom = async () => {
        setError('');

        if (!roomId || roomId.length !== 6) {
            setError('Please enter a valid 6-digit room ID');
            return;
        }

        setLoading(true);
        try {
            await onJoinRoom(roomId);
        } catch (err) {
            setError(err.message || 'Failed to join room');
        } finally {
            setLoading(false);
        }
    };

    const displayError = error || externalError;

    return (
        <div className="w-full max-w-md space-y-6">
            {/* Create Room */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-2xl hover:bg-white/10 transition-all duration-300">
                <h2 className="text-2xl font-bold text-white mb-4">Create a Room</h2>
                <p className="text-gray-300 mb-6">Start a new video call and share the room ID</p>
                <Button
                    variant="primary"
                    size="large"
                    onClick={handleCreateRoom}
                    loading={loading}
                    className="w-full flex items-center justify-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Create Room
                </Button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-slate-600"></div>
                <span className="text-gray-400 text-sm font-medium">OR</span>
                <div className="flex-1 h-px bg-slate-600"></div>
            </div>

            {/* Join Room */}
            <div className="glass p-8 rounded-2xl shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-4">Join a Room</h2>
                <p className="text-gray-300 mb-6">Enter the 6-digit room ID to join</p>
                <div className="space-y-4">
                    <RoomInput
                        value={roomId}
                        onChange={setRoomId}
                        error={displayError}
                        label="Room ID"
                    />
                    <Button
                        variant="secondary"
                        size="large"
                        onClick={handleJoinRoom}
                        loading={loading}
                        disabled={!roomId || roomId.length !== 6}
                        className="w-full flex items-center justify-center gap-2"
                    >
                        <LogIn className="w-5 h-5" />
                        Join Room
                    </Button>
                </div>
            </div>
        </div>
    );
}
