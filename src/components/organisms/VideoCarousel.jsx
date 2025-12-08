/**
 * VideoCarousel Component (Organism)
 * Horizontal carousel for displaying multiple video feeds
 */
import React from 'react';
import VideoPlayer from '../molecules/VideoPlayer';

export default function VideoCarousel({ participants, className = '' }) {
    if (!participants || participants.length === 0) {
        return null;
    }

    return (
        <div className={`w-full bg-slate-900/50 backdrop-blur-sm ${className}`}>
            <div className="flex gap-3 overflow-x-auto p-4 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
                {participants.map((participant) => (
                    <div
                        key={participant.id}
                        className="flex-shrink-0 w-64 h-48 relative rounded-lg overflow-hidden border-2 border-slate-600 hover:border-blue-500 transition-colors"
                    >
                        <VideoPlayer
                            stream={participant.stream}
                            name={participant.name}
                            showVideo={participant.videoEnabled}
                            muted={participant.muted}
                            mirrored={participant.isLocal}
                            className="w-full h-full object-cover"
                        />
                        {/* Role badge */}
                        {participant.role && (
                            <div className="absolute top-2 right-2 px-2 py-1 bg-blue-600/90 backdrop-blur-sm rounded text-xs font-medium text-white">
                                {participant.role}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
