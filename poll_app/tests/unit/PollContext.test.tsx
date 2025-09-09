// #File: lib/pollContext.tsx
// #Docs: This test verifies the PollContext functionality for managing polls state

import { render, screen, act } from '@testing-library/react';
import { PollProvider, usePollContext } from '../../lib/pollContext';
import '@testing-library/jest-dom';

// Mock component that uses the poll context
const TestComponent = () => {
  const { polls, loading, error } = usePollContext();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h1>Polls</h1>
      <div data-testid="poll-count">{polls.length}</div>
      <ul>
        {polls.map(poll => (
          <li key={poll.id}>{poll.title}</li>
        ))}
      </ul>
    </div>
  );
};

// Mock Supabase client
jest.mock('../../lib/supabaseClient', () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        data: [
          {
            id: '1',
            title: 'Test Poll 1',
            description: 'Description 1',
            options: [
              { id: '1', text: 'Option 1', votes: 0 },
              { id: '2', text: 'Option 2', votes: 0 },
            ],
            user_id: 'user1',
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            title: 'Test Poll 2',
            description: 'Description 2',
            options: [
              { id: '3', text: 'Option A', votes: 0 },
              { id: '4', text: 'Option B', votes: 0 },
            ],
            user_id: 'user1',
            created_at: new Date().toISOString()
          }
        ],
        error: null,
      }),
    }),
    auth: {
      getUser: () => ({
        data: { user: { id: 'user1' } },
        error: null,
      }),
    },
  }),
}));

describe('PollContext', () => {
  it('provides polls data to components', async () => {
    render(
      <PollProvider>
        <TestComponent />
      </PollProvider>
    );

    // Should show polls
    expect(screen.getByText('Polls')).toBeInTheDocument();
    expect(screen.getByTestId('poll-count')).toHaveTextContent('2');
    expect(screen.getByText('Favorite Programming Language?')).toBeInTheDocument();
    expect(screen.getByText('Best Frontend Framework?')).toBeInTheDocument();
  });
});