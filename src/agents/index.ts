
import { Agent } from '@/types/agent';
import { AnalistaRequisitosAgent } from './AnalistaRequisitosAgent';
import { RedatorAgent } from './RedatorAgent';
import { EstrategistaAgent } from './EstrategistaAgent';
import { AnalistaFatosAgent } from './AnalistaFatosAgent';
import { EspecialistaAdaptavelAgent } from './EspecialistaAdaptavelAgent';
import { RevisorLegalAgent } from './RevisorLegalAgent';
import { RevisorIntegradorAgent } from './RevisorIntegradorAgent';
import { ComunicadorAgent } from './ComunicadorAgent';
import { PesquisadorAgent } from './PesquisadorAgent';
import { AnalistaArgumentacaoAgent } from './AnalistaArgumentacaoAgent';
import { AssistenteRedacaoAgent } from './AssistenteRedacaoAgent';

const agents: Agent[] = [
  new AnalistaRequisitosAgent(),
  new RedatorAgent(),
  new EstrategistaAgent(),
  new AnalistaFatosAgent(),
  new EspecialistaAdaptavelAgent(),
  new RevisorLegalAgent(),
  new RevisorIntegradorAgent(),
  new ComunicadorAgent(),
  new PesquisadorAgent(),
  new AnalistaArgumentacaoAgent(),
  new AssistenteRedacaoAgent()
];

export const getAgent = (type: string): Agent | undefined => {
  return agents.find(agent => agent.type === type);
};

export const getAllAgents = (): Agent[] => {
  return agents;
};
