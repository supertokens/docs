import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('Example test', () => {
  it('renders without crashing', () => {
    render(<div data-testid="example">Hello Testing</div>);
    expect(screen.getByTestId('example')).toBeInTheDocument();
    expect(screen.getByText('Hello Testing')).toBeInTheDocument();
  });
});