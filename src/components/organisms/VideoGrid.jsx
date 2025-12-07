/**
 * VideoGrid Component (Organism)
 * Google Meet style layout with main video and picture-in-picture
 */
import React from 'react';
import VideoPlayer from '../molecules/VideoPlayer';

export default function VideoGrid({
  localStream,
  remoteStream,
  localVideoEnabled,
  remoteVideoEnabled,
  localName = 'You',
  remoteName = 'Peer',
}) {
  return (
    <div className="absolute w-full h-[90vh] bg-black overflow-hidden">
      {/* Remote video (main view) */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-slate-900">
        {remoteStream ? (
          <VideoPlayer
            stream={remoteStream}
            name={remoteName}
            showVideo={remoteVideoEnabled}
            className="w-full h-full object-cover flex items-center justify-center"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to from-slate-800 to-slate-900">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-700 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-lg font-medium text-gray-300">
                Waiting for peer to join...
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Share the room ID with them
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Local video (picture-in-picture) */}
      {localStream && (
        <div className="fixed bottom-5 right-5 w-64 h-48 z-10 shadow-2xl rounded-lg overflow-hidden border-2 border-slate-600 hover:border-blue-500 transition-colors">
          <VideoPlayer
            stream={localStream}
            muted={true}
            mirrored={true}
            name={localName}
            showVideo={localVideoEnabled}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
