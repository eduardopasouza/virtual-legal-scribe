
import { render, screen } from '@testing-library/react';
import { CaseDetailsContent } from '../CaseDetailsContent';

describe('CaseDetailsContent', () => {
  const mockProps = {
    caseId: '123',
    caseData: {
      id: '123',
      title: 'Test Case',
      type: 'Civil',
      status: 'em_andamento',
      created_at: '2024-04-27T00:00:00Z',
      client: 'John Doe',
    },
    activities: [
      {
        id: '1',
        action: 'Test Activity',
        agent: 'Test Agent',
        created_at: '2024-04-27T00:00:00Z'
      }
    ],
    isLoadingActivities: false
  };

  it('should render case header with correct information', () => {
    render(<CaseDetailsContent {...mockProps} />);
    
    expect(screen.getByText('Test Case')).toBeInTheDocument();
    expect(screen.getByText('Civil')).toBeInTheDocument();
    expect(screen.getByText('Em Andamento')).toBeInTheDocument();
  });

  it('should render activity list when activities are provided', () => {
    render(<CaseDetailsContent {...mockProps} />);
    
    expect(screen.getByText('Test Activity')).toBeInTheDocument();
    expect(screen.getByText('Test Agent')).toBeInTheDocument();
  });

  it('should show loading state for activities when isLoadingActivities is true', () => {
    render(<CaseDetailsContent {...mockProps} isLoadingActivities={true} />);
    
    expect(screen.getByTestId('activity-list-loading')).toBeInTheDocument();
  });
});
