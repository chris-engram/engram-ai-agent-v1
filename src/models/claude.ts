import Anthropic from '@anthropic-ai/sdk';
import { ModelProvider } from './base';
import { Message } from '../memory';
import { Tool } from '../tools/base';
import { config } from '../config';

export class ClaudeProvider extends ModelProvider {
  private client?: Anthropic;
  
  async initialize(): Promise<void> {
    const cfg = config.get();
    if (!cfg.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is required for Claude models');
    }
    
    this.client = new Anthropic({
      apiKey: cfg.ANTHROPIC_API_KEY,
    });
  }
  
  async generate(messages: Message[], tools?: Tool[]): Promise<string> {
    if (!this.client) {
      throw new Error('Claude client not initialized');
    }
    
    const formattedMessages = messages.map(m => ({
      role: m.role === 'system' ? 'user' : m.role,
      content: m.content,
    }));
    
    const response = await this.client.messages.create({
      model: this.config.model,
      max_tokens: this.config.maxTokens || 4096,
      temperature: this.config.temperature || 0.7,
      messages: formattedMessages as any,
    });
    
    return response.content[0].type === 'text' 
      ? response.content[0].text 
      : '';
  }
  
  async streamGenerate(
    messages: Message[],
    tools?: Tool[],
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    // Implement streaming for Claude
    // For now, fallback to regular generate
    return this.generate(messages, tools);
  }
}
