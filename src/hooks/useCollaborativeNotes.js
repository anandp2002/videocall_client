/**
 * useCollaborativeNotes Hook
 * Manages Y.js document with custom Socket.IO integration
 */
import { useEffect, useState } from 'react';
import * as Y from 'yjs';
import socketService from '../services/socketService';

export default function useCollaborativeNotes(roomId) {
    const [ydoc] = useState(() => new Y.Doc());
    const [isConnected, setIsConnected] = useState(false);
    const [connectedUsers, setConnectedUsers] = useState([]);

    useEffect(() => {
        if (!roomId) return;

        const socket = socketService.getSocket();

        if (!socket) {
            console.error('Socket.IO not initialized');
            return;
        }

        console.log('🔗 Setting up Y.js sync for room:', roomId);

        // Track connection status
        const handleConnect = () => {
            setIsConnected(true);
            console.log('✅ Y.js connected');

            // Send initial sync request
            const stateVector = Y.encodeStateVector(ydoc);
            socket.emit('yjs-sync-step1', {
                roomId,
                stateVector: Array.from(stateVector)
            });
        };

        const handleDisconnect = () => {
            setIsConnected(false);
            console.log('❌ Y.js disconnected');
        };

        // Handle sync step 2 (receive initial state from server)
        const handleSyncStep2 = ({ update }) => {
            console.log('📥 Received initial sync');
            Y.applyUpdate(ydoc, new Uint8Array(update));
        };

        // Handle updates from other clients
        const handleUpdate = ({ update }) => {
            console.log('📥 Received update from peer');
            Y.applyUpdate(ydoc, new Uint8Array(update));
        };

        // Send updates to server when local document changes
        const handleLocalUpdate = (update, origin) => {
            // Don't send updates that came from the network
            if (origin !== 'network') {
                console.log('📤 Sending update to server');
                socket.emit('yjs-update', {
                    roomId,
                    update: Array.from(update)
                });
            }
        };

        // Set up event listeners
        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);
        socket.on('yjs-sync-step2', handleSyncStep2);
        socket.on('yjs-update', handleUpdate);
        ydoc.on('update', handleLocalUpdate);

        // Initial connection check
        if (socket.connected) {
            handleConnect();
        }

        // Cleanup
        return () => {
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
            socket.off('yjs-sync-step2', handleSyncStep2);
            socket.off('yjs-update', handleUpdate);
            ydoc.off('update', handleLocalUpdate);
            console.log('🧹 Cleaned up Y.js sync');
        };
    }, [roomId, ydoc]);

    return {
        ydoc,
        isConnected,
        connectedUsers,
    };
}
