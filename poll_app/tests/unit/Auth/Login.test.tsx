import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../../../components/Auth/Login';
import '@testing-library/jest-dom';
import { usePollContext } from '@/lib/pollContext';
import { useRouter } from 'next/navigation';

// Mock the context and router
jest.mock('@/lib/pollContext');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockUsePollContext = usePollContext as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;

describe('Login', () => {
  let mockLogin: jest.Mock;
  let mockPush: jest.Mock;

  beforeEach(() => {
    mockLogin = jest.fn();
    mockPush = jest.fn();
    mockUsePollContext.mockReturnValue({ login: mockLogin });
    mockUseRouter.mockReturnValue({ push: mockPush });
    jest.clearAllMocks();
  });

  it('renders the login form', () => {
    render(<Login />);

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('updates input fields on user input', () => {
    render(<Login />);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('shows an error message when submitting with empty fields', async () => {
    render(<Login />);

    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    expect(await screen.findByText(/Please enter both email and password/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('calls login and redirects on successful submission', async () => {
    render(<Login />);

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    expect(mockLogin).toHaveBeenCalledWith('test@example.com');
    expect(mockPush).toHaveBeenCalledWith('/polls');
  });

  it('displays an error message on login failure', async () => {
    const errorMessage = 'Invalid credentials';
    mockLogin.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    
    // The handleLogin function in Login.tsx catches the error and sets it.
    // We need to wait for the state update.
    await screen.findByText(errorMessage);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('displays a generic error message for unknown errors', async () => {
    mockLogin.mockImplementation(() => {
      throw 'a string error';
    });

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await screen.findByText(/An unknown error occurred/i);

    expect(screen.getByText(/An unknown error occurred/i)).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
