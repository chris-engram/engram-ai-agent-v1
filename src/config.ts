import { config as dotenv } from 'dotenv';
import { z } from 'zod';

const ConfigSchema = z.object({
  ANTHROPIC_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  MAX_RETRIES: z.number().default(3),
  TIMEOUT_MS: z.number().default(30000),
});

export type Config = z.infer<typeof ConfigSchema>;

class ConfigManager {
  private config?: Config;
  
  async load(): Promise<Config> {
    dotenv();
    
    this.config = ConfigSchema.parse({
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      LOG_LEVEL: process.env.LOG_LEVEL || 'info',
      MAX_RETRIES: Number(process.env.MAX_RETRIES) || 3,
      TIMEOUT_MS: Number(process.env.TIMEOUT_MS) || 30000,
    });
    
    return this.config;
  }
  
  get(): Config {
    if (!this.config) {
      throw new Error('Config not loaded. Call load() first.');
    }
    return this.config;
  }
}

export const config = new ConfigManager();
