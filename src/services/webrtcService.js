/**
 * WebRTC Service
 * Manages WebRTC peer connection and media streams
 */

class WebRTCService {
    constructor() {
        this.peerConnection = null;
        this.localStream = null;
        this.configuration = {
            iceServers: [
                {
                    urls: import.meta.env.VITE_STUN_SERVER || 'stun:20.197.32.121:3478',
                },
                {
                    urls: import.meta.env.VITE_TURN_SERVER || 'turn:20.197.32.121:3478',
                    username: import.meta.env.VITE_TURN_USERNAME || 'tpl',
                    credential: import.meta.env.VITE_TURN_PASSWORD || 'tpl@2024',
                },
            ],
            iceCandidatePoolSize: 10,
        };
    }

    /**
     * Initialize peer connection
     */
    createPeerConnection() {
        this.peerConnection = new RTCPeerConnection(this.configuration);
        console.log('🔗 Peer connection created');
        return this.peerConnection;
    }

    /**
     * Get user media (camera and microphone)
     */
    async getUserMedia(constraints = { video: true, audio: true }) {
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
            console.log('🎥 Got local stream');
            return this.localStream;
        } catch (error) {
            console.error('Error getting user media:', error);
            throw new Error('Failed to access camera/microphone. Please grant permissions.');
        }
    }

    /**
     * Add local stream to peer connection
     */
    addLocalStream() {
        if (!this.peerConnection || !this.localStream) {
            throw new Error('Peer connection or local stream not initialized');
        }

        this.localStream.getTracks().forEach((track) => {
            this.peerConnection.addTrack(track, this.localStream);
        });
        console.log('📤 Added local stream to peer connection');
    }

    /**
     * Create an offer
     */
    async createOffer() {
        if (!this.peerConnection) {
            throw new Error('Peer connection not initialized');
        }

        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offer);
        console.log('📝 Created offer');
        return offer;
    }

    /**
     * Create an answer
     */
    async createAnswer() {
        if (!this.peerConnection) {
            throw new Error('Peer connection not initialized');
        }

        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);
        console.log('📝 Created answer');
        return answer;
    }

    /**
     * Set remote description
     */
    async setRemoteDescription(description) {
        if (!this.peerConnection) {
            throw new Error('Peer connection not initialized');
        }

        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(description));
        console.log('📥 Set remote description');
    }

    /**
     * Add ICE candidate
     */
    async addIceCandidate(candidate) {
        if (!this.peerConnection) {
            throw new Error('Peer connection not initialized');
        }

        await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        console.log('🧊 Added ICE candidate');
    }

    /**
     * Toggle audio mute
     */
    toggleAudio(enabled) {
        if (this.localStream) {
            this.localStream.getAudioTracks().forEach((track) => {
                track.enabled = enabled;
            });
            console.log(`🎤 Audio ${enabled ? 'enabled' : 'disabled'}`);
        }
    }

    /**
     * Toggle video
     */
    toggleVideo(enabled) {
        if (this.localStream) {
            this.localStream.getVideoTracks().forEach((track) => {
                track.enabled = enabled;
            });
            console.log(`📹 Video ${enabled ? 'enabled' : 'disabled'}`);
        }
    }

    /**
     * Close peer connection and stop local stream
     */
    close() {
        if (this.localStream) {
            this.localStream.getTracks().forEach((track) => track.stop());
            this.localStream = null;
        }

        if (this.peerConnection) {
            this.peerConnection.close();
            this.peerConnection = null;
        }

        console.log('🔌 WebRTC connection closed');
    }

    /**
     * Get peer connection
     */
    getPeerConnection() {
        return this.peerConnection;
    }

    /**
     * Get local stream
     */
    getLocalStream() {
        return this.localStream;
    }
}

export default new WebRTCService();
