"use client";
import React, { createContext, useContext, useState } from "react";

export type Poll = {
  id: string;
  title: string;
  description: string;
  options: { id: string; text: string; votes: number }[];
};

export type User = {
  email: string;
};

interface PollContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  polls: Poll[];
  createPoll: (title: string, description: string, options: string[]) => void;
  vote: (pollId: string, optionId: string) => void;
}

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
    },
  ]);

  const login = (email: string) => setUser({ email });
  const logout = () => setUser(null);

  const createPoll = (title: string, description: string, options: string[]) => {
    setPolls((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).slice(2),
        title,
        description,
        options: options.map((text, i) => ({ id: `${i}`, text, votes: 0 })),
      },
    ]);
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

  return (
    <PollContext.Provider value={{ user, login, logout, polls, createPoll, vote }}>
      {children}
    </PollContext.Provider>
  );
};
