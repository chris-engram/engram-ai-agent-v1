export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export class Memory {
  private messages: Message[] = [];
  private maxMessages: number = 100;
  
  constructor(maxMessages?: number) {
    if (maxMessages) {
      this.maxMessages = maxMessages;
    }
  }
  
  addMessage(role: Message['role'], content: string): void {
    this.messages.push({
      role,
      content,
      timestamp: new Date(),
    });
    
    // Trim if exceeds max
    if (this.messages.length > this.maxMessages) {
      this.messages = this.messages.slice(-this.maxMessages);
    }
  }
  
  getMessages(): Message[] {
    return [...this.messages];
  }
  
  clear(): void {
    this.messages = [];
  }
  
  getLastN(n: number): Message[] {
    return this.messages.slice(-n);
  }
  
  findByRole(role: Message['role']): Message[] {
    return this.messages.filter(m => m.role === role);
  }
}
