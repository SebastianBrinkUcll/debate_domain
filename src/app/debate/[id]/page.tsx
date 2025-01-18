'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { useAuth } from '@/contexts/AuthContext';
import { FaUser, FaPaperPlane, FaTrophy, FaClock } from 'react-icons/fa';
import DebateResults from '@/components/DebateResults';
import VoiceDebate from '@/components/VoiceDebate';

interface Message {
  userId: string;
  username: string;
  content: string;
  timestamp: number;
  round: number;
}

interface DebateState {
  currentRound: number;
  currentSpeaker: string | null;
  timeLeft: number;
  isActive: boolean;
  topic: string;
}

interface EloChange {
  winner: {
    id: string;
    oldElo: number;
    newElo: number;
  };
  loser: {
    id: string;
    oldElo: number;
    newElo: number;
  };
}

interface DebateResult {
  isWinner: boolean;
  eloChange: number;
  newElo: number;
  scores: {
    logicalConsistency: number;
    evidence: number;
    delivery: number;
    persuasiveness: number;
    total: number;
    feedback: string[];
  };
}

export default function DebateRoom() {
  const params = useParams();
  const debateId = params.id as string;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [opponent, setOpponent] = useState<string | null>(null);
  const [debateState, setDebateState] = useState<DebateState>({
    currentRound: 1,
    currentSpeaker: null,
    timeLeft: 60, // 1 minute per round
    isActive: false,
    topic: 'Should social media be regulated more strictly?', // Example topic
  });
  const socket = useSocket();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [debateResult, setDebateResult] = useState<DebateResult | null>(null);
  const router = useRouter();
  const [isVoiceMode, setIsVoiceMode] = useState(true); // Default to voice mode

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket || !user) return;

    socket.emit('join-debate', { debateId, userId: user.id });

    socket.on('debate-message', (message: Message) => {
      setMessages(prev => [...prev, { ...message, timestamp: Date.now() }]);
    });

    socket.on('debate-state-update', (newState: DebateState) => {
      setDebateState(newState);
    });

    socket.on('opponent-joined', (opponentName: string) => {
      setOpponent(opponentName);
      // Start debate when opponent joins
      socket.emit('start-debate', { debateId });
    });

    socket.on('debate-ended', (data: { 
      messages: Message[], 
      winner: string,
      eloChanges: EloChange,
      scores: {
        logicalConsistency: number;
        evidence: number;
        delivery: number;
        persuasiveness: number;
        total: number;
        feedback: string[];
      }
    }) => {
      const isWinner = data.winner === user.id;
      const eloChange = isWinner 
        ? data.eloChanges.winner.newElo - data.eloChanges.winner.oldElo
        : data.eloChanges.loser.newElo - data.eloChanges.loser.oldElo;

      setDebateResult({
        isWinner,
        eloChange,
        newElo: isWinner ? data.eloChanges.winner.newElo : data.eloChanges.loser.newElo,
        scores: data.scores || {
          logicalConsistency: 0,
          evidence: 0,
          delivery: 0,
          persuasiveness: 0,
          total: 0,
          feedback: []
        }
      });
    });

    return () => {
      socket.emit('leave-debate', { debateId, userId: user.id });
      socket.off('debate-message');
      socket.off('debate-state-update');
      socket.off('opponent-joined');
      socket.off('debate-ended');
    };
  }, [socket, debateId, user]);

  useEffect(() => {
    if (debateState.isActive && debateState.timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setDebateState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [debateState.isActive, debateState.timeLeft]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !socket) return;
    if (debateState.currentSpeaker !== user.id) return; // Can only send message when it's your turn

    const message = {
      debateId,
      userId: user.id,
      username: user.username,
      content: newMessage.trim(),
      timestamp: Date.now(),
      round: debateState.currentRound
    };

    socket.emit('send-message', message);
    setNewMessage('');
  };

  const handleResultsClose = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Debate Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
              <div className="text-center">
                <h2 className="text-xl font-bold mb-4">Round {debateState.currentRound}/3</h2>
                <div className="flex items-center justify-center space-x-2">
                  <FaClock className="text-gray-500" />
                  <span className="font-mono text-lg">
                    {Math.floor(debateState.timeLeft / 60)}:
                    {(debateState.timeLeft % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">Topic</h3>
                <p className="text-gray-700">{debateState.topic}</p>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">Participants</h3>
                <div className="space-y-2">
                  <div className={`flex items-center space-x-2 ${
                    debateState.currentSpeaker === user?.id ? 'text-green-500 font-bold' : ''
                  }`}>
                    <FaUser className="text-blue-500" />
                    <span>{user?.username}</span>
                    {debateState.currentSpeaker === user?.id && 
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Speaking
                      </span>
                    }
                  </div>
                  {opponent && (
                    <div className={`flex items-center space-x-2 ${
                      debateState.currentSpeaker === opponent ? 'text-green-500 font-bold' : ''
                    }`}>
                      <FaUser className="text-red-500" />
                      <span>{opponent}</span>
                      {debateState.currentSpeaker === opponent && 
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Speaking
                        </span>
                      }
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg h-[600px] flex flex-col">
              {isVoiceMode ? (
                <VoiceDebate
                  debateId={debateId}
                  currentRound={debateState.currentRound}
                  timeLeft={debateState.timeLeft}
                  isCurrentSpeaker={debateState.currentSpeaker === user?.id}
                />
              ) : (
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.userId === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-4 ${
                          msg.userId === user?.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold">{msg.username}</span>
                          <span className="text-xs opacity-75">Round {msg.round}</span>
                        </div>
                        <p className="break-words">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}

              {/* Message Input */}
              <div className="border-t p-4">
                <form onSubmit={sendMessage} className="flex space-x-4">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={debateState.currentSpeaker !== user?.id}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                    placeholder={
                      debateState.currentSpeaker === user?.id 
                        ? "Type your argument..." 
                        : "Waiting for your turn..."
                    }
                  />
                  <button
                    type="submit"
                    disabled={debateState.currentSpeaker !== user?.id}
                    className="bg-blue-500 text-white rounded-lg px-6 py-2 hover:bg-blue-600 transition-colors flex items-center space-x-2 disabled:bg-gray-400"
                  >
                    <span>Send</span>
                    <FaPaperPlane className="text-sm" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {debateResult && (
        <DebateResults
          isWinner={debateResult.isWinner}
          eloChange={debateResult.eloChange}
          newElo={debateResult.newElo}
          scores={debateResult.scores}
          onClose={handleResultsClose}
        />
      )}
    </div>
  );
} 