"use client";

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { FaChartLine, FaUsers, FaTrophy } from 'react-icons/fa';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to{' '}
            <span className="text-blue-600 dark:text-blue-400">
              DebateDomain
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Engage in meaningful debates, improve your skills, and climb the ranks.
          </p>
          
          {user ? (
            <Link
              href="/dashboard"
              className="btn-primary text-lg px-8 py-3 shadow-lg hover:shadow-xl"
            >
              Go to Dashboard
            </Link>
          ) : (
            <div className="space-x-4">
              <Link
                href="/login"
                className="btn-secondary text-lg px-8 py-3"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="btn-primary text-lg px-8 py-3 shadow-lg hover:shadow-xl"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card-transition card p-6 text-center">
            <div className="inline-block p-3 bg-blue-100 dark:bg-blue-900 rounded-lg mb-4">
              <FaUsers className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-Time Debates</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Engage in live debates with users from around the world
            </p>
          </div>

          <div className="card-transition card p-6 text-center">
            <div className="inline-block p-3 bg-green-100 dark:bg-green-900 rounded-lg mb-4">
              <FaChartLine className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Skill Rating</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Improve your ELO rating and track your progress
            </p>
          </div>

          <div className="card-transition card p-6 text-center">
            <div className="inline-block p-3 bg-purple-100 dark:bg-purple-900 rounded-lg mb-4">
              <FaTrophy className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Leaderboards</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Compete to reach the top of the global rankings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


