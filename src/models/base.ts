import { Message } from '../memory';
import { Tool } from '../tools/base';

export abstract class ModelProvider {
  protected config: any;
  
  constructor(config: any) {
    this.config = config;
  }
  
  abstract initialize(): Promise<void>;
  
  abstract generate(
    messages: Message[],
    tools?: Tool[]
  ): Promise<string>;
  
  abstract streamGenerate(
    messages: Message[],
    tools?: Tool[],
    onChunk?: (chunk: string) => void
  ): Promise<string>;
}
