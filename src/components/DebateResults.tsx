'use client';

import React from 'react';
import { FaTrophy, FaChartLine, FaMedal } from 'react-icons/fa';

interface Score {
  logicalConsistency: number;
  evidence: number;
  persuasiveness: number;
  delivery: number;
  total: number;
  feedback: string[];
}

interface DebateResultsProps {
  isWinner: boolean;
  eloChange: number;
  newElo: number;
  scores: Score;
  onClose: () => void;
}

export default function DebateResults({ isWinner, eloChange, newElo, scores, onClose }: DebateResultsProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full mx-4">
        <div className="text-center mb-6">
          {isWinner ? (
            <div className="text-yellow-500 text-6xl mb-4">
              <FaTrophy />
            </div>
          ) : (
            <div className="text-blue-500 text-6xl mb-4">
              <FaMedal />
            </div>
          )}
          
          <h2 className="text-2xl font-bold mb-2">
            {isWinner ? 'Victory!' : 'Good Effort!'}
          </h2>
          
          <div className="flex items-center justify-center space-x-2 mb-6">
            <FaChartLine className={eloChange >= 0 ? 'text-green-500' : 'text-red-500'} />
            <span className="text-xl font-semibold">
              {eloChange >= 0 ? '+' : ''}{eloChange} ELO
            </span>
          </div>

          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <p className="text-gray-600">New Rating</p>
            <p className="text-2xl font-bold">{newElo}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Performance Scores</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Logical Consistency</span>
                <span className="font-mono">{scores.logicalConsistency}/10</span>
              </div>
              <div className="flex justify-between">
                <span>Evidence & Support</span>
                <span className="font-mono">{scores.evidence}/10</span>
              </div>
              <div className="flex justify-between">
                <span>Persuasiveness</span>
                <span className="font-mono">{scores.persuasiveness}/10</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery & Clarity</span>
                <span className="font-mono">{scores.delivery}/10</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Overall Score</span>
                <span className="font-mono">{scores.total.toFixed(1)}/10</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-lg">AI Feedback</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              {scores.feedback.map((feedback, index) => (
                <p key={index} className="text-sm text-gray-600">{feedback}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-sm text-blue-600">ELO Rating Change</p>
            <p className="text-2xl font-bold text-blue-700">
              {eloChange >= 0 ? '+' : ''}{eloChange} ({newElo})
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white rounded-lg py-3 hover:bg-blue-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
} 