// #File: components/EditPollForm.tsx
// #Docs: This component handles editing of polls, including validation and submission

import { render, screen, fireEvent } from '@testing-library/react';
import EditPollForm from '../../components/EditPollForm';
import '@testing-library/jest-dom';

const mockPoll = {
  id: '1',
  title: 'Test Poll Title',
  description: 'Test poll description',
  options: [
    { id: '1', text: 'Option 1', votes: 0 },
    { id: '2', text: 'Option 2', votes: 0 },
  ],
  user_id: 'user1',
  created_at: new Date().toISOString()
};

const mockOnSubmit = jest.fn();
const mockOnCancel = jest.fn();

describe('EditPollForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form with poll data', () => {
    render(
      <EditPollForm 
        poll={mockPoll} 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel} 
      />
    );

    // Check if title and description are populated
    expect(screen.getByLabelText(/Poll Title/i)).toHaveValue(mockPoll.title);
    expect(screen.getByLabelText(/Description/i)).toHaveValue(mockPoll.description);
    
    // Check if options are rendered
    mockPoll.options.forEach(option => {
      expect(screen.getByDisplayValue(option.text)).toBeInTheDocument();
    });
  });

  it('validates title length', () => {
    render(
      <EditPollForm 
        poll={mockPoll} 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel} 
      />
    );

    const titleInput = screen.getByLabelText(/Poll Title/i);
    
    // Clear the title
    fireEvent.change(titleInput, { target: { value: '' } });
    fireEvent.blur(titleInput);
    
    // Check for error message
    expect(screen.getByText(/Title is required/i)).toBeInTheDocument();
    
    // Enter a short title
    fireEvent.change(titleInput, { target: { value: 'Short' } });
    fireEvent.blur(titleInput);
    
    // Check for error message about minimum length
    expect(screen.getByText(/Title must be at least/i)).toBeInTheDocument();
  });

  it('submits the form with valid data', () => {
    render(
      <EditPollForm 
        poll={mockPoll} 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel} 
      />
    );

    // Submit the form
    fireEvent.click(screen.getByText(/Save Changes/i));
    
    // Check if onSubmit was called
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith({
      ...mockPoll,
      title: mockPoll.title,
      description: mockPoll.description,
      options: mockPoll.options
    });
  });

  it('cancels editing when cancel button is clicked', () => {
    render(
      <EditPollForm 
        poll={mockPoll} 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel} 
      />
    );

    // Click cancel button
    fireEvent.click(screen.getByText(/Cancel/i));
    
    // Check if onCancel was called
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
});