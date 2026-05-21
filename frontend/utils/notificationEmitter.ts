type Listener = (...args: any[]) => void;

class SimpleEventEmitter {
  private listeners = new Map<string, Set<Listener>>();

  on(event: string, fn: Listener) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(fn);
  }

  off(event: string, fn: Listener) {
    this.listeners.get(event)?.delete(fn);
  }

  emit(event: string, ...args: any[]) {
    console.log(`[notificationEmitter] emit "${event}"`, args, `listeners: ${this.listeners.get(event)?.size ?? 0}`);
    this.listeners.get(event)?.forEach((fn) => fn(...args));
  }

  removeAllListeners(event?: string) {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }
}

export const notificationEmitter = new SimpleEventEmitter();
