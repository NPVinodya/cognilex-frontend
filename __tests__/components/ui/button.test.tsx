import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('renders in a disabled state (often used for loading)', () => {
    render(<Button disabled>Loading...</Button>);
    const button = screen.getByRole('button', { name: /loading/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
  });

  it('renders correctly with different variants', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button', { name: /delete/i });
    expect(button).toHaveClass('bg-destructive');
  });
});
