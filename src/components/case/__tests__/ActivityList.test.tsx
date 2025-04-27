
import { render, screen } from '@testing-library/react';
import { ActivityList } from '../ActivityList';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

describe('ActivityList', () => {
  const mockActivities = [
    {
      id: '1',
      action: 'Created document',
      agent: 'System',
      created_at: '2024-04-27T10:00:00Z'
    },
    {
      id: '2',
      action: 'Updated case',
      agent: 'User',
      created_at: '2024-04-27T11:00:00Z'
    }
  ];

  it('should render all activities in chronological order', () => {
    render(<ActivityList activities={mockActivities} isLoading={false} />);
    
    const activities = screen.getAllByRole('listitem');
    expect(activities).toHaveLength(2);
    
    expect(screen.getByText('Created document')).toBeInTheDocument();
    expect(screen.getByText('Updated case')).toBeInTheDocument();
  });

  it('should render loading skeleton when isLoading is true', () => {
    render(<ActivityList activities={[]} isLoading={true} />);
    
    expect(screen.getByTestId('activity-list-loading')).toBeInTheDocument();
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  it('should render empty state when no activities are provided', () => {
    render(<ActivityList activities={[]} isLoading={false} />);
    
    expect(screen.getByText(/Nenhuma atividade registrada/i)).toBeInTheDocument();
  });

  it('should format dates correctly in Brazilian Portuguese', () => {
    render(<ActivityList activities={mockActivities} isLoading={false} />);
    
    const formattedDate = format(new Date('2024-04-27T10:00:00Z'), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    expect(screen.getByText(formattedDate)).toBeInTheDocument();
  });
});
