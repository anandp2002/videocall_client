/**
 * useRoom Hook
 * Custom hook for room management
 */

import { useState, useCallback, useEffect } from 'react';
import socketService from '../services/socketService';
import { useNavigate } from 'react-router-dom';

export default function useRoom() {
    const [roomId, setRoomId] = useState(null);
    const [error, setError] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const navigate = useNavigate();

    /**
     * Connect to socket server
     */
    useEffect(() => {
        // Only connect if not already connected
        if (!socketService.getSocket()?.connected) {
            socketService.connect();
        }
        setIsConnected(true);

        // Don't disconnect on cleanup - let the socket stay connected
        // It will be cleaned up when the browser tab closes
    }, []);

    /**
     * Create a new room
     */
    const createRoom = useCallback(() => {
        return new Promise((resolve, reject) => {
            socketService.emit('create-room');

            const handleRoomCreated = ({ roomId }) => {
                console.log('🏠 Room created:', roomId);
                setRoomId(roomId);
                setError(null);
                socketService.off('room-created', handleRoomCreated);
                socketService.off('error', handleError);
                navigate(`/call/${roomId}`);
                resolve(roomId);
            };

            const handleError = ({ message }) => {
                console.error('Error creating room:', message);
                setError(message);
                socketService.off('room-created', handleRoomCreated);
                socketService.off('error', handleError);
                reject(new Error(message));
            };

            socketService.on('room-created', handleRoomCreated);
            socketService.on('error', handleError);
        });
    }, [navigate]);

    /**
     * Join an existing room
     */
    const joinRoom = useCallback((roomId) => {
        return new Promise((resolve, reject) => {
            socketService.emit('join-room', { roomId });

            const handleRoomJoined = () => {
                console.log('🚪 Joined room:', roomId);
                setRoomId(roomId);
                setError(null);
                socketService.off('room-joined', handleRoomJoined);
                socketService.off('error', handleError);
                navigate(`/call/${roomId}`);
                resolve(roomId);
            };

            const handleError = ({ message }) => {
                console.error('Error joining room:', message);
                setError(message);
                socketService.off('room-joined', handleRoomJoined);
                socketService.off('error', handleError);
                reject(new Error(message));
            };

            socketService.on('room-joined', handleRoomJoined);
            socketService.on('error', handleError);
        });
    }, [navigate]);

    /**
     * Leave the current room
     */
    const leaveRoom = useCallback(() => {
        if (roomId) {
            socketService.emit('leave-room');
            setRoomId(null);
            navigate('/');
        }
    }, [roomId, navigate]);

    return {
        roomId,
        error,
        isConnected,
        createRoom,
        joinRoom,
        leaveRoom,
    };
}
