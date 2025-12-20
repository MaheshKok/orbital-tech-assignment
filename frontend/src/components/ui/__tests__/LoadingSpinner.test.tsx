/**
 * Unit tests for LoadingSpinner component.
 */

import { render, screen } from '../../../test/testUtils';
import { LoadingSpinner } from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('should render with default message', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render with custom message', () => {
    render(<LoadingSpinner message="Fetching data..." />);
    expect(screen.getByText('Fetching data...')).toBeInTheDocument();
  });

  it('should have correct role for accessibility', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should have screen reader text', () => {
    render(<LoadingSpinner message="Loading data" />);
    expect(screen.getByText('Loading data')).toBeInTheDocument();
  });
});
