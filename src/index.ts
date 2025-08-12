import { Agent } from './agent';
import { config } from './config';

/**
 * Main entry point for the Engram AI Agent
 */
export async function main() {
  console.log('🚀 Starting Engram AI Agent v1...');
  
  // Initialize configuration
  await config.load();
  
  // Create and start agent
  const agent = new Agent({
    name: 'Engram Agent',
    model: 'claude-3-opus-20240229',
    temperature: 0.7,
  });
  
  await agent.initialize();
  console.log('✅ Agent initialized successfully');
  
  // Example usage
  const response = await agent.chat('Hello! What can you help me with today?');
  console.log('Agent response:', response);
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { Agent } from './agent';
export { Tool } from './tools/base';
export { Memory } from './memory';
