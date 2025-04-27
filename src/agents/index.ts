
import { Agent } from '@/types/agent';
import { AnalistaRequisitosAgent } from './AnalistaRequisitosAgent';
import { RedatorAgent } from './RedatorAgent';

const agents: Agent[] = [
  new AnalistaRequisitosAgent(),
  new RedatorAgent(),
];

export const getAgent = (type: string): Agent | undefined => {
  return agents.find(agent => agent.type === type);
};

export const getAllAgents = (): Agent[] => {
  return agents;
};
