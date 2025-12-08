/**
 * CallPage
 * Active video call interface with note editor integration
 */
import React from 'react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Copy, Check, StickyNote, Video, Maximize2 } from 'lucide-react';
import VideoGrid from '../organisms/VideoGrid';
import ControlPanel from '../organisms/ControlPanel';
import NoteEditor from '../organisms/NoteEditor';
import VideoCarousel from '../organisms/VideoCarousel';
import FloatingNotePanel from '../organisms/FloatingNotePanel';
import useWebRTC from '../../hooks/useWebRTC';
import socketService from '../../services/socketService';

export default function CallPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [layoutMode, setLayoutMode] = useState('note-first'); // 'note-first', 'video-first'
  const [showFloatingNotes, setShowFloatingNotes] = useState(false);

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

  // Prepare participants for carousel
  const participants = [
    {
      id: 'local',
      stream: localStream,
      name: 'You',
      videoEnabled: !isVideoOff,
      muted: true,
      isLocal: true,
      role: 'Teacher', // TODO: Get from user role
    },
    remoteStream && {
      id: 'remote',
      stream: remoteStream,
      name: 'Peer',
      videoEnabled: true,
      muted: false,
      isLocal: false,
      role: 'Student', // TODO: Get from peer data
    },
  ].filter(Boolean);

  const LayoutButton = ({ onClick, active, icon: Icon, children }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm border ${active
          ? 'bg-blue-600 border-blue-500 text-white'
          : 'bg-slate-700 border-slate-600 text-gray-300 hover:bg-slate-600 hover:border-blue-500'
        }`}
    >
      <Icon className="w-4 h-4" />
      {children}
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      {/* Header */}
      <div className="h-[10vh] bg-black/40 backdrop-blur-xl px-6 py-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-white">
            Room ID: <span className="text-blue-400">{roomId}</span>
          </h2>
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

        {/* Layout controls */}
        <div className="flex items-center gap-3">
          <LayoutButton
            onClick={() => setLayoutMode('note-first')}
            active={layoutMode === 'note-first'}
            icon={StickyNote}
          >
            Note View
          </LayoutButton>
          <LayoutButton
            onClick={() => setLayoutMode('video-first')}
            active={layoutMode === 'video-first'}
            icon={Video}
          >
            Video View
          </LayoutButton>
          <LayoutButton
            onClick={() => setShowFloatingNotes(!showFloatingNotes)}
            active={showFloatingNotes}
            icon={Maximize2}
          >
            Pop Out
          </LayoutButton>

          <div className="w-px h-6 bg-slate-600 mx-2" />

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
            <span className="text-sm text-gray-300">Connected</span>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {layoutMode === 'note-first' ? (
          // Note-first layout: Notes 70%, Video carousel at top
          <div className="flex-1 flex flex-col">
            <VideoCarousel participants={participants} />
            <div className="flex-1 p-4">
              <NoteEditor roomId={roomId} />
            </div>
          </div>
        ) : (
          // Video-first layout: Video main, Notes in side panel
          <div className="flex-1 flex">
            {/* Video area */}
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
            {/* Notes side panel */}
            <div className="w-[30%] min-w-[400px] border-l border-slate-700 p-4">
              <NoteEditor roomId={roomId} />
            </div>
          </div>
        )}
      </div>

      {/* Control Panel */}
      <ControlPanel
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        onToggleMute={toggleMute}
        onToggleVideo={toggleVideo}
        onEndCall={handleEndCall}
      />

      {/* Floating note panel */}
      {showFloatingNotes && (
        <FloatingNotePanel
          roomId={roomId}
          onClose={() => setShowFloatingNotes(false)}
        />
      )}
    </div>
  );
}
