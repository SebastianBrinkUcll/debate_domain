'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function MatchmakingQueue() {
  const [inQueue, setInQueue] = useState(false);
  const [searchTime, setSearchTime] = useState(0);
  const socket = useSocket();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (inQueue) {
      interval = setInterval(() => {
        setSearchTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [inQueue]);

  useEffect(() => {
    if (!socket) return;

    socket.on('match-found', (debateData) => {
      setInQueue(false);
      router.push(`/debate/${debateData.debateId}`);
    });

    return () => {
      socket.off('match-found');
    };
  }, [socket, router]);

  const joinQueue = () => {
    if (!user) return;
    socket.emit('join-queue', user.id);
    setInQueue(true);
    setSearchTime(0);
  };

  const leaveQueue = () => {
    if (!user) return;
    socket.emit('leave-queue', user.id);
    setInQueue(false);
    setSearchTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6">
      {!inQueue ? (
        <button
          onClick={joinQueue}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Join Debate Queue
        </button>
      ) : (
        <div className="text-center space-y-4">
          <p className="text-lg">Looking for opponent...</p>
          <p className="text-sm text-gray-500">Time elapsed: {formatTime(searchTime)}</p>
          <button
            onClick={leaveQueue}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}