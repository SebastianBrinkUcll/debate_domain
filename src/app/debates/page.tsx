'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface Debate {
  id: string;
  topic: string;
  status: string;
  createdAt: string;
  participants: string[];
}

export default function DebatesPage() {
  const [debates, setDebates] = useState<Debate[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDebates = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/debates', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch debates');
        }
        
        const data = await response.json();
        setDebates(data);
      } catch (error) {
        console.error('Error fetching debates:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDebates();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <p>Please log in to view debates.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <p>Loading debates...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Debates</h1>
        <Link
          href="/matchmaking"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
        >
          Find New Debate
        </Link>
      </div>

      {debates.length === 0 ? (
        <p>No debates found. Join the matchmaking queue to start debating!</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {debates.map((debate) => (
            <div
              key={debate.id}
              className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold mb-2">{debate.topic}</h3>
              <p className="text-sm text-gray-600 mb-2">
                Status: {debate.status}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Created: {new Date(debate.createdAt).toLocaleDateString()}
              </p>
              <Link
                href={`/debate/${debate.id}`}
                className="text-primary hover:text-primary-dark"
              >
                View Debate →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 