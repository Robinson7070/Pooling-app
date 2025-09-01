// Central type definitions for the Polling App

// Poll related types
export type Poll = {
  id: string;
  title: string;
  description: string;
  options: PollOption[];
  user_id?: string;
  created_at?: string;
};

export type PollOption = {
  id: string;
  text: string;
  votes: number;
};

// User related types
export type User = {
  id?: string;
  email: string;
};

// Form related types
export type FormMessage = {
  type: "success" | "error";
  text: string;
};

// EditPollForm related types
export interface EditPollFormProps {
  poll: Poll;
  onSubmit: (updatedPoll: Poll) => void;
  onCancel: () => void;
}

export interface PollContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  polls: Poll[];
  createPoll: (title: string, description: string, options: string[]) => void;
  vote: (pollId: string, optionId: string) => void;
  updatePoll: (updatedPoll: Poll) => void;
}