import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PollDetailPage from '../../app/polls/[id]/page';
import { usePollContext } from '../../lib/pollContext';
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

// Mock the usePollContext hook
jest.mock('../../lib/pollContext');

const mockUsePollContext = usePollContext as jest.Mock;

describe('Poll Voting Integration', () => {
  it('displays poll details and allows voting', async () => {
    const mockVote = jest.fn();
    mockUsePollContext.mockReturnValue({
      polls: [
        {
          id: '1',
          title: 'Favorite Programming Language?',
          description: 'Vote for your favorite language!',
          options: [
            { id: 'a', text: 'JavaScript', votes: 2 },
            { id: 'b', text: 'Python', votes: 3 },
            { id: 'c', text: 'TypeScript', votes: 1 },
          ],
          user_id: 'mock-user-1',
          created_at: '2023-01-01T00:00:00Z'
        },
      ],
      vote: mockVote,
      user: { id: 'user2' },
    });

    render(<PollDetailPage />);

    // Wait for poll to load
    await waitFor(() => {
      expect(screen.getByText('Favorite Programming Language?')).toBeInTheDocument();
    });

    // Check if poll description is displayed
    expect(screen.getByText('Vote for your favorite language!')).toBeInTheDocument();

    // Check if options are displayed
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();

    // Select an option to vote for
    fireEvent.click(screen.getByLabelText('JavaScript'));

    // Click the submit button
    const submitButton = screen.getByRole('button', { name: /Submit Vote/i });
    fireEvent.click(submitButton);

    // Check that the vote function was called
    expect(mockVote).toHaveBeenCalledWith('1', 'a');

    // Check that the thank you message appears
    await waitFor(() => {
      expect(screen.getByText('Thank you for voting!')).toBeInTheDocument();
    });
  });
});
