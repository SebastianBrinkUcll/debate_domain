'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { useAuth } from '@/contexts/AuthContext';
import dynamic from 'next/dynamic';
import { FaMicrophone, FaMicrophoneSlash, FaClock } from 'react-icons/fa';

interface VoiceDebateProps {
  debateId: string;
  currentRound: number;
  timeLeft: number;
  isCurrentSpeaker: boolean;
}

export default function VoiceDebate({ debateId, currentRound, timeLeft, isCurrentSpeaker }: VoiceDebateProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const recorder = useRef<any>(null);
  const socket = useSocket();
  const { user } = useAuth();
  const [RecordRTCModule, setRecordRTCModule] = useState<any>(null);

  useEffect(() => {
    // Load RecordRTC dynamically only in browser
    if (typeof window !== 'undefined') {
      import('recordrtc').then(module => {
        setRecordRTCModule(module.default);
      });
    }
  }, []);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    if (isCurrentSpeaker) {
      startMicrophone();
    } else {
      stopRecording();
    }
    
    return () => {
      stopRecording();
    };
  }, [isCurrentSpeaker]);

  const startMicrophone = async () => {
    try {
      if (!RecordRTCModule) return;
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(mediaStream);
      
      recorder.current = new RecordRTCModule(mediaStream, {
        type: 'audio',
        mimeType: 'audio/webm',
        recorderType: RecordRTCModule.StereoAudioRecorder,
        timeSlice: 1000, // Send audio data every second
        ondataavailable: (blob: Blob) => {
          if (socket) {
            // Convert blob to base64 and send to server
            const reader = new FileReader();
            reader.onloadend = () => {
              socket.emit('voice-data', {
                debateId,
                userId: user?.id,
                audio: reader.result,
                round: currentRound
              });
            };
            reader.readAsDataURL(blob);
          }
        }
      });
      
      recorder.current.startRecording();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (recorder.current) {
      recorder.current.stopRecording(() => {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
        }
      });
      setIsRecording(false);
    }
  };

  if (!socket) {
    return <div>Connecting to debate server...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {isRecording ? (
            <FaMicrophone className="text-red-500 animate-pulse" />
          ) : (
            <FaMicrophoneSlash className="text-gray-500" />
          )}
          <span className="font-medium">
            {isRecording ? 'Recording...' : 'Waiting for your turn'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <FaClock />
          <span className="font-mono">
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>
      <div className="text-center text-sm text-gray-600">
        Round {currentRound}/3
        {isCurrentSpeaker && (
          <p className="mt-2 text-green-600">It's your turn to speak!</p>
        )}
      </div>
    </div>
  );
} 