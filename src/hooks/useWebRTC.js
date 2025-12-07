/**
 * useWebRTC Hook
 * Custom hook for managing WebRTC connection and media controls
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import webrtcService from '../services/webrtcService';
import socketService from '../services/socketService';

export default function useWebRTC(roomId) {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [connectionState, setConnectionState] = useState('new');
    const [error, setError] = useState(null);

    const isInitiator = useRef(false);
    const iceCandidateQueue = useRef([]);

    /**
     * Initialize local media stream
     */
    const initializeMedia = useCallback(async () => {
        try {
            const stream = await webrtcService.getUserMedia();
            setLocalStream(stream);

            // If peer connection already exists (e.g. created by incoming offer),
            // add the stream to it now
            const pc = webrtcService.getPeerConnection();
            if (pc) {
                console.log('🔗 Peer connection exists, adding local stream now');
                webrtcService.addLocalStream();
                // If we've already created an offer/answer, we might need to renegotiate,
                // but usually this happens before the answer is sent in the joiner case
                // because handleOffer has an await setRemoteDescription.
                // However, handleOffer might be running in parallel.
            }
            return stream;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    /**
     * Setup peer connection
     */
    const setupPeerConnection = useCallback(() => {
        const pc = webrtcService.createPeerConnection();

        // Add local stream if available
        if (webrtcService.getLocalStream()) {
            webrtcService.addLocalStream();
        } else {
            console.warn('⚠️ Local stream not available when setting up peer connection');
        }

        // Handle remote stream
        pc.ontrack = (event) => {
            console.log('📥 Received remote track');
            setRemoteStream(event.streams[0]);
        };

        // Handle ICE candidates
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                console.log('🧊 Sending ICE candidate');
                socketService.emit('ice-candidate', {
                    candidate: event.candidate,
                    roomId,
                });
            }
        };

        // Handle connection state changes
        pc.onconnectionstatechange = () => {
            console.log('Connection state:', pc.connectionState);
            setConnectionState(pc.connectionState);
        };

        // Process queued ICE candidates
        if (iceCandidateQueue.current.length > 0) {
            console.log(`🧊 Processing ${iceCandidateQueue.current.length} queued ICE candidates`);
            iceCandidateQueue.current.forEach(candidate => {
                webrtcService.addIceCandidate(candidate).catch(err => {
                    console.error('Error adding queued ICE candidate:', err);
                });
            });
            iceCandidateQueue.current = [];
        }

        return pc;
    }, [roomId]);

    /**
     * Create and send offer
     */
    const createOffer = useCallback(async () => {
        try {
            const offer = await webrtcService.createOffer();
            socketService.emit('offer', { offer, roomId });
        } catch (err) {
            console.error('Error creating offer:', err);
            setError('Failed to create offer');
        }
    }, [roomId]);

    /**
     * Handle incoming offer
     */
    const handleOffer = useCallback(async (offer) => {
        try {
            await webrtcService.setRemoteDescription(offer);

            // Process queued ICE candidates after remote description is set
            if (iceCandidateQueue.current.length > 0) {
                console.log(`🧊 Processing ${iceCandidateQueue.current.length} queued ICE candidates after offer`);
                for (const candidate of iceCandidateQueue.current) {
                    try {
                        await webrtcService.addIceCandidate(candidate);
                    } catch (err) {
                        console.error('Error adding queued ICE candidate:', err);
                    }
                }
                iceCandidateQueue.current = [];
            }

            const answer = await webrtcService.createAnswer();
            socketService.emit('answer', { answer, roomId });
        } catch (err) {
            console.error('Error handling offer:', err);
            setError('Failed to handle offer');
        }
    }, [roomId]);

    /**
     * Handle incoming answer
     */
    const handleAnswer = useCallback(async (answer) => {
        try {
            await webrtcService.setRemoteDescription(answer);

            // Process queued ICE candidates after remote description is set
            if (iceCandidateQueue.current.length > 0) {
                console.log(`🧊 Processing ${iceCandidateQueue.current.length} queued ICE candidates after answer`);
                for (const candidate of iceCandidateQueue.current) {
                    try {
                        await webrtcService.addIceCandidate(candidate);
                    } catch (err) {
                        console.error('Error adding queued ICE candidate:', err);
                    }
                }
                iceCandidateQueue.current = [];
            }
        } catch (err) {
            console.error('Error handling answer:', err);
            setError('Failed to handle answer');
        }
    }, [roomId]);

    /**
     * Handle incoming ICE candidate
     */
    const handleIceCandidate = useCallback(async (candidate) => {
        try {
            const pc = webrtcService.getPeerConnection();
            if (!pc || !pc.remoteDescription) {
                // Queue the candidate if peer connection isn't ready
                console.log('🧊 Queuing ICE candidate (peer connection not ready)');
                iceCandidateQueue.current.push(candidate);
            } else {
                await webrtcService.addIceCandidate(candidate);
            }
        } catch (err) {
            console.error('Error adding ICE candidate:', err);
        }
    }, []);

    /**
     * Toggle mute
     */
    const toggleMute = useCallback(() => {
        const newMutedState = !isMuted;
        webrtcService.toggleAudio(!newMutedState);
        setIsMuted(newMutedState);
    }, [isMuted]);

    /**
     * Toggle video
     */
    const toggleVideo = useCallback(() => {
        const newVideoState = !isVideoOff;
        webrtcService.toggleVideo(!newVideoState);
        setIsVideoOff(newVideoState);
    }, [isVideoOff]);

    /**
     * Setup socket listeners
     */
    useEffect(() => {
        if (!roomId) return;

        const handlePeerJoined = () => {
            console.log('👤 Peer joined, creating offer');
            isInitiator.current = true;
            setupPeerConnection();
            createOffer();
        };

        const handleOfferReceived = ({ offer }) => {
            console.log('📨 Received offer');
            if (!webrtcService.getPeerConnection()) {
                console.log('🔗 Setting up peer connection for joiner');
                setupPeerConnection();
            }
            handleOffer(offer);
        };

        const handleAnswerReceived = ({ answer }) => {
            console.log('📨 Received answer');
            handleAnswer(answer);
        };

        const handleIceCandidateReceived = ({ candidate }) => {
            console.log('📨 Received ICE candidate');
            handleIceCandidate(candidate);
        };

        const handlePeerLeft = () => {
            console.log('👋 Peer left');
            setRemoteStream(null);
        };

        socketService.on('peer-joined', handlePeerJoined);
        socketService.on('offer', handleOfferReceived);
        socketService.on('answer', handleAnswerReceived);
        socketService.on('ice-candidate', handleIceCandidateReceived);
        socketService.on('peer-left', handlePeerLeft);

        return () => {
            socketService.off('peer-joined', handlePeerJoined);
            socketService.off('offer', handleOfferReceived);
            socketService.off('answer', handleAnswerReceived);
            socketService.off('ice-candidate', handleIceCandidateReceived);
            socketService.off('peer-left', handlePeerLeft);
        };
    }, [roomId, setupPeerConnection, createOffer, handleOffer, handleAnswer, handleIceCandidate]);

    /**
     * Send ready signal to server
     */
    const sendReadySignal = useCallback(() => {
        if (roomId) {
            console.log('✅ Sending ready signal');
            socketService.emit('ready', { roomId });
        }
    }, [roomId]);

    /**
     * Cleanup on unmount
     */
    useEffect(() => {
        return () => {
            webrtcService.close();
        };
    }, []);

    return {
        localStream,
        remoteStream,
        isMuted,
        isVideoOff,
        connectionState,
        error,
        initializeMedia,
        toggleMute,
        toggleVideo,
        setupPeerConnection,
        sendReadySignal,
    };
}
