
import { WorkflowStage as BaseWorkflowStage, WorkflowStatus } from '@/workflow/types';

export interface WorkflowStage extends Omit<BaseWorkflowStage, 'status'> {
  status: 'pending' | 'in_progress' | 'completed';
}

export const mapWorkflowStatus = (status: WorkflowStatus): WorkflowStage['status'] => {
  switch (status) {
    case 'failed':
      return 'in_progress';
    default:
      return status as WorkflowStage['status'];
  }
};
