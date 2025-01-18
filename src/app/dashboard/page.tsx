"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";
import MatchmakingQueue from "@/components/MatchmakingQueue";
import { FaTrophy, FaChartLine, FaUsers, FaSearch } from 'react-icons/fa';
import { User } from "@/types";

export default function Dashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQueue, setShowQueue] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500">Your Rating</p>
                    <h3 className="text-2xl font-bold">{user?.elo || 1000}</h3>
                  </div>
                  <FaChartLine className="text-3xl text-blue-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500">Wins</p>
                    <h3 className="text-2xl font-bold">0</h3>
                  </div>
                  <FaTrophy className="text-3xl text-green-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500">Total Debates</p>
                    <h3 className="text-2xl font-bold">0</h3>
                  </div>
                  <FaUsers className="text-3xl text-purple-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Debates</h2>
              <div className="text-gray-500 text-center py-8">
                No recent debates found
              </div>
            </div>
          </div>

          {/* Right Column - Matchmaking & Online Users */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Match</h2>
              {showQueue ? (
                <MatchmakingQueue />
              ) : (
                <button
                  onClick={() => setShowQueue(true)}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FaSearch className="text-lg" />
                  Find Debate
                </button>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaUsers className="text-gray-400" />
                Online Users
              </h2>
              {loading ? (
                <div className="animate-pulse space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-10 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium">{user.username}</span>
                      <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        {user.elo} ELO
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
