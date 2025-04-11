export class ServerConnectionPool {
  private pool: Set<string> = new Set();
  private listeners: Set<(type: 'add' | 'delete', payload: { clientId: string }) => void> = new Set();

  public add(clientId: string): void {
    this.pool.add(clientId);

    this.listeners.forEach((listener) => {
      listener('add', { clientId });
    });
  }

  public delete(clientId: string): void {
    this.pool.delete(clientId);

    this.listeners.forEach((listener) => {
      listener('delete', { clientId });
    });
  }

  public has(clientId: string): boolean {
    return this.pool.has(clientId);
  }

  public addListener(listener: (type: 'add' | 'delete', payload: { clientId: string }) => void): () => void {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  public toArray(): string[] {
    return Array.from(this.pool);
  }
}
