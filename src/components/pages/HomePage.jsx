/**
 * HomePage
 * Landing page with room creation and joining
 */
import React from 'react'
import { Video } from 'lucide-react';
import RoomJoinForm from '../organisms/RoomJoinForm';
import useRoom from '../../hooks/useRoom';


export default function HomePage() {
    const { createRoom, joinRoom, error } = useRoom();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
            {/* Header */}
            <div className="text-center mb-12 animate-fade-in">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-2xl shadow-blue-500/50">
                        <Video className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                        VideoCall
                    </h1>
                </div>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                    Premium video calling experience with crystal-clear quality
                </p>
                <p className="text-sm text-gray-400 mt-2">
                    Powered by WebRTC • End-to-end encrypted
                </p>
            </div>

            {/* Room Join Form */}
            <div className="animate-slide-up">
                <RoomJoinForm
                    onCreateRoom={createRoom}
                    onJoinRoom={joinRoom}
                    error={error}
                />
            </div>

            {/* Features */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-xl text-center hover:bg-white/10 transition-all duration-300 hover:scale-105">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <span className="text-2xl">🔒</span>
                    </div>
                    <h3 className="font-semibold text-white mb-2">Secure</h3>
                    <p className="text-sm text-gray-400">End-to-end encrypted calls</p>
                </div>
                <div className="glass p-6 rounded-xl text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary-500/20 flex items-center justify-center">
                        <span className="text-2xl">⚡</span>
                    </div>
                    <h3 className="font-semibold text-white mb-2">Fast</h3>
                    <p className="text-sm text-gray-400">Low latency connections</p>
                </div>
                <div className="glass p-6 rounded-xl text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary-500/20 flex items-center justify-center">
                        <span className="text-2xl">🎯</span>
                    </div>
                    <h3 className="font-semibold text-white mb-2">Simple</h3>
                    <p className="text-sm text-gray-400">No account required</p>
                </div>
            </div>
        </div>
    );
}
