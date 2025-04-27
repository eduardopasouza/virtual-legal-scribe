
import { Agent, AgentType, AgentTask, AgentResult } from '@/types/agent';

export abstract class BaseAgent implements Agent {
  constructor(
    public readonly type: AgentType,
    public readonly name: string,
    public readonly description: string
  ) {}

  abstract execute(task: AgentTask): Promise<AgentResult>;
  
  isAvailable(): boolean {
    return true;
  }
}
