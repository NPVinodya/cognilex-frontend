import React from 'react';
import { render, screen } from '@testing-library/react';
import { Progress } from '@/components/ui/progress';

describe('Progress Component', () => {
  it('renders correctly', () => {
    render(<Progress value={50} />);
    // The progress component is a div with a specific data-state or style based on value
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
  });
});
