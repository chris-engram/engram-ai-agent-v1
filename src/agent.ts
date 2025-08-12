import { EventEmitter } from 'events';
import { Memory } from './memory';
import { ToolRegistry } from './tools/registry';
import { ModelProvider } from './models/base';
import { ClaudeProvider } from './models/claude';

export interface AgentConfig {
  name: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export class Agent extends EventEmitter {
  private config: AgentConfig;
  private memory: Memory;
  private tools: ToolRegistry;
  private model: ModelProvider;
  
  constructor(config: AgentConfig) {
    super();
    this.config = config;
    this.memory = new Memory();
    this.tools = new ToolRegistry();
    this.model = this.createModelProvider();
  }
  
  private createModelProvider(): ModelProvider {
    if (this.config.model.includes('claude')) {
      return new ClaudeProvider(this.config);
    }
    throw new Error(`Unsupported model: ${this.config.model}`);
  }
  
  async initialize(): Promise<void> {
    await this.model.initialize();
    this.emit('initialized');
  }
  
  async chat(message: string): Promise<string> {
    // Add to memory
    this.memory.addMessage('user', message);
    
    // Get response from model
    const response = await this.model.generate(
      this.memory.getMessages(),
      this.tools.getAvailable()
    );
    
    // Add response to memory
    this.memory.addMessage('assistant', response);
    
    this.emit('message', { role: 'assistant', content: response });
    return response;
  }
  
  registerTool(tool: any): void {
    this.tools.register(tool);
  }
  
  getMemory(): Memory {
    return this.memory;
  }
}
