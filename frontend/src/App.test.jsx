import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('Application Authentication Guard', () => {
  it('renders the sign in screen for unauthenticated users', () => {
    render(<App />);
    expect(screen.getByText(/Welcome Back|Create an Account/i)).toBeInTheDocument();
  });
});