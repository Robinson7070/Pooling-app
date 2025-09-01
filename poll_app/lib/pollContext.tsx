"use client";
import React, { createContext, useContext, useState } from "react";
import { Poll, User, PollContextType, PollOption } from "./index";

const PollContext = createContext<PollContextType | undefined>(undefined);

export const usePollContext = () => {
  const ctx = useContext(PollContext);
  if (!ctx) throw new Error("usePollContext must be used within PollProvider");
  return ctx;
};

export const PollProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [polls, setPolls] = useState<Poll[]>([
    {
      id: "1",
      title: "Favorite Programming Language?",
      description: "Vote for your favorite language!",
      options: [
        { id: "a", text: "JavaScript", votes: 2 },
        { id: "b", text: "Python", votes: 3 },
        { id: "c", text: "TypeScript", votes: 1 },
      ],
      user_id: "mock-user-1",
      created_at: "2023-01-01T00:00:00Z"
    },
    {
      id: "2",
      title: "Best Frontend Framework?",
      description: "Choose the best!",
      options: [
        { id: "a", text: "React", votes: 4 },
        { id: "b", text: "Vue", votes: 2 },
        { id: "c", text: "Angular", votes: 1 },
      ],
      user_id: "mock-user-1",
      created_at: "2023-01-02T00:00:00Z"
    },
  ]);

  const login = (email: string) => setUser({ id: Math.random().toString(36).slice(2), email });
  const logout = () => setUser(null);

  const createPoll = (title: string, description: string, options: string[]) => {
    if (!user) return;
    
    const newPoll: Poll = {
      id: Math.random().toString(36).slice(2),
      title,
      description,
      options: options.map((text, i) => ({ id: `${i}`, text, votes: 0 })),
      user_id: user.id,
      created_at: new Date().toISOString()
    };
    
    setPolls((prev) => [...prev, newPoll]);
  };

  const vote = (pollId: string, optionId: string) => {
    setPolls((prev) =>
      prev.map((poll) =>
        poll.id === pollId
          ? {
              ...poll,
              options: poll.options.map((opt) =>
                opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
              ),
            }
          : poll
      )
    );
  };

  const updatePoll = (updatedPoll: Poll) => {
    setPolls((prev) =>
      prev.map((poll) =>
        poll.id === updatedPoll.id ? updatedPoll : poll
      )
    );
  };

  return (
    <PollContext.Provider value={{ user, login, logout, polls, createPoll, vote, updatePoll }}>
      {children}
    </PollContext.Provider>
  );
};
