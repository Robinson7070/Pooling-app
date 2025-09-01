'use client';

import React from 'react';
import { Poll } from '../lib/pollContext';

type PollResultChartProps = {
  poll: Poll;
  className?: string;
};

export default function PollResultChart({ poll, className = '' }: PollResultChartProps) {
  // Calculate total votes
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
  
  // Generate a color for each option
  const getColorForIndex = (index: number) => {
    const colors = [
      'bg-blue-500',   // Blue
      'bg-green-500',  // Green
      'bg-purple-500', // Purple
      'bg-yellow-500', // Yellow
      'bg-red-500',    // Red
      'bg-indigo-500', // Indigo
      'bg-pink-500',   // Pink
      'bg-teal-500',   // Teal
    ];
    return colors[index % colors.length];
  };

  // Calculate percentage for each option
  const calculatePercentage = (votes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold">Poll Results</h3>
      
      {/* Bar Chart */}
      <div className="space-y-3">
        {poll.options.map((option, index) => {
          const percentage = calculatePercentage(option.votes);
          return (
            <div key={option.id} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{option.text}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{option.votes} votes</span>
                  <span className="text-sm font-medium">{percentage}%</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className={`${getColorForIndex(index)} h-4 rounded-full transition-all duration-500 ease-out`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Votes */}
      <div className="text-sm text-gray-500 text-right pt-2">
        Total votes: {totalVotes}
      </div>
    </div>
  );
}