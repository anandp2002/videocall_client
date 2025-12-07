/**
 * Socket Service
 * Manages Socket.IO connection and events
 */

import { io } from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
    }

    connect() {
        const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

        this.socket = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
        });

        this.socket.on('connect', () => {
            console.log('✅ Connected to signaling server:', this.socket.id);
        });

        this.socket.on('disconnect', () => {
            console.log('❌ Disconnected from signaling server');
        });

        this.socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    emit(event, data) {
        if (this.socket) {
            this.socket.emit(event, data);
        }
    }

    on(event, callback) {
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    off(event, callback) {
        if (this.socket) {
            this.socket.off(event, callback);
        }
    }

    getSocket() {
        return this.socket;
    }
}

export default new SocketService();
