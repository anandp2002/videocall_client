/**
 * ControlPanel Component (Organism)
 * Floating control panel with media controls
 */
import React from 'react'
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import ControlButton from '../molecules/ControlButton';

export default function ControlPanel({
    isMuted,
    isVideoOff,
    onToggleMute,
    onToggleVideo,
    onEndCall,
}) {
    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20">
            <div className="bg-black/40 backdrop-blur-xl px-6 py-4 rounded-2xl shadow-2xl border border-white/10">
                <div className="flex items-center gap-4">
                    {/* Mute/Unmute */}
                    <ControlButton
                        icon={Mic}
                        activeIcon={MicOff}
                        isActive={isMuted}
                        onClick={onToggleMute}
                        tooltip="Mute"
                        activeTooltip="Unmute"
                    />

                    {/* Video On/Off */}
                    <ControlButton
                        icon={Video}
                        activeIcon={VideoOff}
                        isActive={isVideoOff}
                        onClick={onToggleVideo}
                        tooltip="Turn off camera"
                        activeTooltip="Turn on camera"
                    />

                    {/* End Call */}
                    <ControlButton
                        icon={PhoneOff}
                        onClick={onEndCall}
                        danger={true}
                        tooltip="End call"
                    />
                </div>
            </div>
        </div>
    );
}
