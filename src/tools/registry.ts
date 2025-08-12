import { Tool } from './base';

export class ToolRegistry {
  private tools: Map<string, Tool> = new Map();
  
  register(tool: Tool): void {
    if (this.tools.has(tool.name)) {
      throw new Error(`Tool ${tool.name} already registered`);
    }
    this.tools.set(tool.name, tool);
  }
  
  unregister(name: string): void {
    this.tools.delete(name);
  }
  
  get(name: string): Tool | undefined {
    return this.tools.get(name);
  }
  
  getAvailable(): Tool[] {
    return Array.from(this.tools.values());
  }
  
  execute(name: string, params: any): Promise<any> {
    const tool = this.get(name);
    if (!tool) {
      throw new Error(`Tool ${name} not found`);
    }
    
    const validatedParams = tool.validate(params);
    return tool.execute(validatedParams);
  }
}
