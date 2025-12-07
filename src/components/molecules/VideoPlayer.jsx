/**
 * VideoPlayer Component (Molecule)
 * Video element wrapper with name label and avatar fallback
 */
import React from 'react'
import { useRef, useEffect } from 'react';
import Avatar from '../atoms/Avatar';

export default function VideoPlayer({
    stream,
    muted = false,
    mirrored = false,
    name = '',
    showVideo = true,
    className = '',
}) {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            console.log(`📹 Setting stream for ${name}:`, stream);
            console.log(`📹 Stream tracks:`, stream.getTracks().map(t => `${t.kind}: ${t.enabled}`));
            videoRef.current.srcObject = stream;
            // Explicitly try to play
            videoRef.current.play().catch(e => {
                if (e.name !== 'AbortError' && e.name !== 'NotAllowedError') {
                    console.error('Error playing video:', e);
                }
            });
        }
    }, [stream, name]);

    const handleCanPlay = () => {
        console.log(`✅ Video can play for ${name}`);
        videoRef.current?.play().catch(() => { });
    };

    return (
        <div className={`relative rounded-lg overflow-hidden ${className}`}>
            {/* Video element */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={muted}
                onLoadedMetadata={handleCanPlay}
                style={{ width: '100%', height: '100%', backgroundColor: '#000' }}
                className={`object-cover ${mirrored ? 'scale-x-[-1]' : ''} ${!showVideo ? 'hidden' : ''}`}
            />

            {/* Avatar fallback when video is off */}
            {!showVideo && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                    <Avatar name={name} size="large" />
                </div>
            )}

            {/* Name label */}
            {name && (
                <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg border border-white/10">
                    <p className="text-sm font-medium text-white">{name}</p>
                </div>
            )}

            {/* Connection indicator */}
            {stream && (
                <div className="absolute top-4 right-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50 ring-2 ring-white/20"></div>
                </div>
            )}
        </div>
    );
}
