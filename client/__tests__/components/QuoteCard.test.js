import { render, screen } from '@testing-library/react';
import QuoteCard from 'src/components/QuoteCard';

describe('QuoteCard', () => {
  it('renders the quote and author', () => {
    render(<QuoteCard quoteText="The obstacle is the way." author="Marcus Aurelius" />);

    expect(screen.getByText(/"The obstacle is the way."/i)).toBeInTheDocument();
    expect(screen.getByText(/— Marcus Aurelius/i)).toBeInTheDocument();
  });
});
