import { render, screen } from '@testing-library/react';
import App from './App';

test('renders MindMatter heading', () => {
  render(<App />);
  const linkElement = screen.getByText(/MindMatter/i);
  expect(linkElement).toBeInTheDocument();
});
