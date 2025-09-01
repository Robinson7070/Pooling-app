// #File: app/polls/[id]/page.tsx
// #Docs: This test verifies that users can vote on polls and see updated results

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PollDetailPage from '../../app/polls/[id]/page';
import { PollContextProvider } from '../../lib/pollContext';
import '@testing-library/jest-dom';

// Mock the Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    refresh: jest.fn(),
  }),
  useParams: () => ({
    id: '1',
  }),
}));

// Mock Supabase client
jest.mock('../../lib/supabaseClient', () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => ({
            data: {
              id: '1',
              title: 'Test Poll',
              description: 'Test description',
              options: [
                { id: '1', text: 'Option 1', votes: 5 },
                { id: '2', text: 'Option 2', votes: 3 },
              ],
              user_id: 'user1',
              created_at: new Date().toISOString()
            },
            error: null,
          }),
        }),
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            data: { votes: 6 },
            error: null,
          }),
        }),
      }),
    }),
    auth: {
      getUser: () => ({
        data: { user: { id: 'user2' } },
        error: null,
      }),
    },
  }),
}));

describe('Poll Voting Integration', () => {
  it('displays poll details and allows voting', async () => {
    render(
      <PollContextProvider>
        <PollDetailPage />
      </PollContextProvider>
    );

    // Wait for poll to load
    await waitFor(() => {
      expect(screen.getByText('Test Poll')).toBeInTheDocument();
    });

    // Check if poll description is displayed
    expect(screen.getByText('Test description')).toBeInTheDocument();

    // Check if options are displayed with vote counts
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('5 votes')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('3 votes')).toBeInTheDocument();

    // Click on the first option to vote
    const voteButtons = screen.getAllByRole('button', { name: /Vote/i });
    fireEvent.click(voteButtons[0]);

    // Check if vote count is updated
    await waitFor(() => {
      expect(screen.getByText('6 votes')).toBeInTheDocument();
    });
  });
});