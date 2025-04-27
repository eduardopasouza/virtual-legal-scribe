
export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMConfig {
  temperature?: number;
  maxTokens?: number;
  stopSequences?: string[];
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export interface LLMProvider {
  generateText(messages: LLMMessage[], config?: LLMConfig): Promise<string>;
  generateStream(messages: LLMMessage[], config?: LLMConfig): AsyncGenerator<string, void, unknown>;
}

export interface LLMOptions {
  provider: LLMProvider;
  defaultConfig?: LLMConfig;
}
