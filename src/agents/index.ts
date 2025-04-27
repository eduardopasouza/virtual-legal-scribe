
import { Agent } from '@/types/agent';
import { AnalistaRequisitosAgent } from './AnalistaRequisitosAgent';
import { RedatorAgent } from './RedatorAgent';
import { EstrategistaAgent } from './EstrategistaAgent';
import { AnalistaFatosAgent } from './AnalistaFatosAgent';
import { EspecialistaAdaptavelAgent } from './EspecialistaAdaptavelAgent';
import { RevisorLegalAgent } from './RevisorLegalAgent';

const agents: Agent[] = [
  new AnalistaRequisitosAgent(),
  new RedatorAgent(),
  new EstrategistaAgent(),
  new AnalistaFatosAgent(),
  new EspecialistaAdaptavelAgent(),
  new RevisorLegalAgent()
];

export const getAgent = (type: string): Agent | undefined => {
  return agents.find(agent => agent.type === type);
};

export const getAllAgents = (): Agent[] => {
  return agents;
};
