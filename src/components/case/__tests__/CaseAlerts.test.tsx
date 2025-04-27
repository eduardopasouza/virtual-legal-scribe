
import { render, screen } from '@testing-library/react';
import { CaseAlerts } from '../CaseAlerts';

describe('CaseAlerts', () => {
  const mockAlerts = [
    {
      id: '1',
      title: 'High Priority Alert',
      description: 'This needs immediate attention',
      priority: 'high',
    },
    {
      id: '2',
      title: 'Medium Priority Alert',
      description: 'This needs attention soon',
      priority: 'medium',
    }
  ];

  it('should render all alerts with correct styling based on priority', () => {
    render(<CaseAlerts alerts={mockAlerts} />);
    
    expect(screen.getByText('High Priority Alert')).toBeInTheDocument();
    expect(screen.getByText('Medium Priority Alert')).toBeInTheDocument();
    
    const highPriorityAlert = screen.getByText('High Priority Alert').closest('div');
    const mediumPriorityAlert = screen.getByText('Medium Priority Alert').closest('div');
    
    expect(highPriorityAlert).toHaveClass('border-red-400');
    expect(mediumPriorityAlert).toHaveClass('border-amber-400');
  });

  it('should render empty state when no alerts are provided', () => {
    render(<CaseAlerts alerts={[]} />);
    
    expect(screen.getByText(/Nenhum alerta pendente/i)).toBeInTheDocument();
  });

  it('should render alert descriptions when provided', () => {
    render(<CaseAlerts alerts={mockAlerts} />);
    
    expect(screen.getByText('This needs immediate attention')).toBeInTheDocument();
    expect(screen.getByText('This needs attention soon')).toBeInTheDocument();
  });
});
