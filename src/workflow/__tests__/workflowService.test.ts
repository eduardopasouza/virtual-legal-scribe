
import { workflowService } from '../workflowService';
import { supabase } from '@/integrations/supabase/client';

// Mock do Supabase
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}));

describe('WorkflowService', () => {
  test('deve registrar progresso do workflow', async () => {
    const caseId = 'test-case-id';
    const message = 'Test progress message';
    const details = { key: 'value' };

    const result = await workflowService.logProgress(caseId, message, details);
    
    expect(result).toBe(true);
    expect(supabase.from).toHaveBeenCalledWith('activities');
  });
});
