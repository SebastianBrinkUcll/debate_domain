export interface User {
  id: string;
  username: string;
  elo: number;
}

export interface Message {
  debateId: string;
  userId: string;
  username: string;
  content: string;
  timestamp: number;
  round: number;
}

export interface DebateState {
  participants: string[];
  currentRound: number;
  currentSpeaker: string | null;
  timeLeft: number;
  isActive: boolean;
  messages: Message[];
  topic: string;
  startTime: number | null;
} 