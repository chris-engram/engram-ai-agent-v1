import { z } from 'zod';

export abstract class Tool {
  abstract name: string;
  abstract description: string;
  abstract parameters: z.ZodSchema<any>;
  
  abstract execute(params: any): Promise<any>;
  
  validate(params: any): any {
    return this.parameters.parse(params);
  }
  
  toJSON() {
    return {
      name: this.name,
      description: this.description,
      parameters: this.parameters,
    };
  }
}
