
import { render, screen, fireEvent } from '@testing-library/react';
import { CaseHeader } from '../CaseHeader';
import { useToast } from '@/hooks/use-toast';

// Mock the toast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(() => ({
    toast: jest.fn()
  }))
}));

describe('CaseHeader', () => {
  const mockProps = {
    title: 'Test Case',
    type: 'Civil',
    status: 'em_andamento',
    createdAt: new Date('2024-04-27')
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all case information correctly', () => {
    render(<CaseHeader {...mockProps} />);
    
    expect(screen.getByText('Test Case')).toBeInTheDocument();
    expect(screen.getByText('Civil')).toBeInTheDocument();
    expect(screen.getByText('Em Andamento')).toBeInTheDocument();
    expect(screen.getByText(/Aberto em 27\/04\/2024/)).toBeInTheDocument();
  });

  it('should trigger share functionality when share button is clicked', () => {
    const mockToast = jest.fn();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });

    render(<CaseHeader {...mockProps} />);
    
    const shareButton = screen.getByText('Compartilhar');
    fireEvent.click(shareButton);

    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
      title: "Link compartilhável copiado"
    }));
  });
});
