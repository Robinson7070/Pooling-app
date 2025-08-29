'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../../components/ui/card';
import { usePollContext } from '../../../lib/pollContext';
import { Poll } from '../../../lib/pollContext';

export default function PollDetailPage() {
  const params = useParams();
  const pollId = params.id as string;
  const router = useRouter();
  const { polls, vote, user } = usePollContext();
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [hasVoted, setHasVoted] = useState(false);
  const [poll, setPoll] = useState<Poll | null>(null);

  // Find the poll with the matching ID
  useEffect(() => {
    const foundPoll = polls.find(p => p.id === pollId);
    if (foundPoll) {
      setPoll(foundPoll);
    } else {
      // If poll not found, redirect to polls list
      router.push('/polls');
    }
  }, [pollId, polls, router]);

  // Redirect to auth page if not logged in
  useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user, router]);

  const handleVote = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOption && poll) {
      vote(poll.id, selectedOption);
      setHasVoted(true);
    }
  };

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!poll) {
    return <div className="flex justify-center items-center min-h-screen">Poll not found</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen py-10">
      <div className="w-full max-w-2xl">
        <Card className="w-full">
          <CardHeader>
            <h2 className="text-2xl font-bold">{poll.title}</h2>
            <p className="text-gray-600">{poll.description}</p>
          </CardHeader>
          <CardContent>
            {!hasVoted ? (
              <form onSubmit={handleVote} className="space-y-4">
                <div className="space-y-2">
                  {poll.options.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={option.id}
                        name="pollOption"
                        value={option.id}
                        checked={selectedOption === option.id}
                        onChange={() => setSelectedOption(option.id)}
                        className="h-4 w-4 text-blue-600"
                        required
                      />
                      <label htmlFor={option.id} className="text-sm font-medium text-gray-700">
                        {option.text}
                      </label>
                    </div>
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={!selectedOption}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                >
                  Submit Vote
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                  <p className="font-bold">Thank you for voting!</p>
                  <p>Your vote has been recorded.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Current Results</h3>
                  {poll.options.map((option) => (
                    <div key={option.id} className="space-y-1">
                      <div className="flex justify-between">
                        <span>{option.text}</span>
                        <span className="text-gray-500">{option.votes} votes</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{
                            width: `${poll.options.reduce((sum, opt) => sum + opt.votes, 0) > 0 ? 
                              (option.votes / poll.options.reduce((sum, opt) => sum + opt.votes, 0)) * 100 : 0}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => router.push('/polls')}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
                >
                  Back to Polls
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}