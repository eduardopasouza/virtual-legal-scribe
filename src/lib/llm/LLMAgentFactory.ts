
import { Agent, AgentResult, AgentTask } from '@/types/agent';
import { LLMProvider, LLMMessage, LLMConfig } from './types';

export abstract class LLMAgentFactory {
  constructor(protected provider: LLMProvider) {}

  protected abstract createSystemPrompt(): string;
  protected abstract createUserPrompt(task: AgentTask): string;
  protected abstract parseResponse(response: string): AgentResult;

  protected getConfig(): LLMConfig {
    return {
      temperature: 0.7,
      maxTokens: 1000,
      topP: 1,
      frequencyPenalty: 0,
      presencePenalty: 0
    };
  }

  async createAgent(): Promise<Agent> {
    const systemPrompt = this.createSystemPrompt();

    return {
      type: 'especialista',
      name: 'LLM Agent',
      description: 'An AI agent powered by LLM',
      isAvailable: () => true,
      execute: async (task: AgentTask) => {
        const messages: LLMMessage[] = [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: this.createUserPrompt(task) }
        ];

        const response = await this.provider.generateText(messages, this.getConfig());
        return this.parseResponse(response);
      }
    };
  }
}
