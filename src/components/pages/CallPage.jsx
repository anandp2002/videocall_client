/**
 * CallPage
 * Active video call interface
 */
import React from 'react'
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Copy, Check } from 'lucide-react';
import VideoGrid from '../organisms/VideoGrid';
import ControlPanel from '../organisms/ControlPanel';
import useWebRTC from '../../hooks/useWebRTC';
import socketService from '../../services/socketService';


export default function CallPage() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);

    const {
        localStream,
        remoteStream,
        isMuted,
        isVideoOff,
        initializeMedia,
        toggleMute,
        toggleVideo,
        sendReadySignal,
    } = useWebRTC(roomId);

    // Initialize media on mount
    useEffect(() => {
        initializeMedia()
            .then(() => {
                sendReadySignal();
            })
            .catch((err) => {
                console.error('Failed to initialize media:', err);
                alert('Failed to access camera/microphone. Please check permissions.');
                navigate('/');
            });
    }, [initializeMedia, sendReadySignal, navigate]);

    // Handle end call
    const handleEndCall = () => {
        socketService.emit('leave-room');
        navigate('/');
    };

    // Copy room ID
    const handleCopyRoomId = async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-900">
            {/* Header */}
            <div className="bg-black/40 backdrop-blur-xl px-6 py-4 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-semibold text-white">Room ID: <span className="text-blue-400">{roomId}</span></h2>
                    <button
                        onClick={handleCopyRoomId}
                        className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm border border-slate-600 hover:border-blue-500"
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4 text-green-500" />
                                <span className="text-green-500 font-medium">Copied!</span>
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-300">Copy</span>
                            </>
                        )}
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                    <span className="text-sm text-gray-300">Connected</span>
                </div>
            </div>

            {/* Video Grid */}
            <div className="flex-1">
                <VideoGrid
                    localStream={localStream}
                    remoteStream={remoteStream}
                    localVideoEnabled={!isVideoOff}
                    remoteVideoEnabled={true}
                    localName="You"
                    remoteName="Peer"
                />
            </div>

            {/* Control Panel */}
            <ControlPanel
                isMuted={isMuted}
                isVideoOff={isVideoOff}
                onToggleMute={toggleMute}
                onToggleVideo={toggleVideo}
                onEndCall={handleEndCall}
            />
        </div>
    );
}
