"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FaClock, FaPaperPlane, FaTrophy } from 'react-icons/fa';
import api from '../services/api';

interface DebateInterfaceProps {
  debateId: number;
  currentUserId: number;
  topic: string;
  roundNumber: number;
  isPlayerOne: boolean;
}

interface Argument {
  id: number;
  content: string;
  user_id: number;
  created_at: string;
}

const DebateInterface: React.FC<DebateInterfaceProps> = ({
  debateId,
  currentUserId,
  topic,
  roundNumber,
  isPlayerOne,
}) => {
  const [argument, setArgument] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [arguments, setArguments] = useState<Argument[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [arguments]);

  // Determine turn based on round number and player position
  useEffect(() => {
    const isCurrentTurn = 
      (isPlayerOne && roundNumber % 2 === 1) || 
      (!isPlayerOne && roundNumber % 2 === 0);
    setIsMyTurn(isCurrentTurn);
  }, [roundNumber, isPlayerOne]);

  // Timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isMyTurn && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isMyTurn) {
      submitArgument();
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isMyTurn, timeLeft]);

  // Fetch existing arguments
  useEffect(() => {
    const fetchArguments = async () => {
      try {
        const response = await api.get(`/debates/${debateId}/arguments`);
        setArguments(response.data);
      } catch (error) {
        console.error('Error fetching arguments:', error);
      }
    };

    fetchArguments();
    // Poll for new arguments every 3 seconds
    const interval = setInterval(fetchArguments, 3000);
    return () => clearInterval(interval);
  }, [debateId]);

  const submitArgument = async () => {
    if (!argument.trim() || !isMyTurn) return;

    setLoading(true);
    try {
      await api.post(`/debates/${debateId}/arguments`, {
        content: argument,
        userId: currentUserId,
        roundNumber
      });
      setArgument('');
      setTimeLeft(60);
      setIsMyTurn(false);
    } catch (error) {
      console.error('Error submitting argument:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Topic Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg">
        <h2 className="text-xl font-semibold mb-2">Topic</h2>
        <p className="text-blue-100">{topic}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm bg-blue-500 px-3 py-1 rounded-full">
            Round {roundNumber}
          </span>
          {isMyTurn && (
            <div className="flex items-center gap-2 text-sm">
              <FaClock />
              <span>{timeLeft}s remaining</span>
            </div>
          )}
        </div>
      </div>

      {/* Arguments Section */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {arguments.map((arg) => (
          <div
            key={arg.id}
            className={`flex ${
              arg.user_id === currentUserId ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-lg ${
                arg.user_id === currentUserId
                  ? 'bg-blue-600 text-white'
                  : 'bg-white shadow-md'
              }`}
            >
              <p className="mb-2">{arg.content}</p>
              <span className={`text-xs ${
                arg.user_id === currentUserId
                  ? 'text-blue-200'
                  : 'text-gray-500'
              }`}>
                {new Date(arg.created_at).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="p-4 bg-white border-t">
        <div className="flex gap-2">
          <textarea
            value={argument}
            onChange={(e) => setArgument(e.target.value)}
            disabled={!isMyTurn || loading}
            placeholder={isMyTurn ? "Type your argument..." : "Waiting for your turn..."}
            className="input-field flex-1 resize-none"
            rows={3}
          />
          <button
            onClick={submitArgument}
            disabled={!isMyTurn || loading || !argument.trim()}
            className="btn-primary self-end flex items-center gap-2"
          >
            <FaPaperPlane />
            Submit
          </button>
        </div>
        {!isMyTurn && (
          <p className="text-sm text-gray-500 mt-2">
            Waiting for opponent's argument...
          </p>
        )}
      </div>
    </div>
  );
};

export default DebateInterface; 