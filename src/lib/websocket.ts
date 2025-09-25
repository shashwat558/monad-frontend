"use client";

export interface GameState {
  gameId: string;
  currentAmount: bigint;
  ethAmount: bigint;
  monAmount: bigint;
  isEthTurn: boolean;
  isGameOver: boolean;
  winner: string | null;
  players: {
    eth: string | null;
    mon: string | null;
  };
}

export interface WebSocketMessage {
  type: 'join' | 'leave' | 'pour' | 'gameState' | 'error';
  gameId?: string;
  role?: 'eth' | 'mon';
  amount?: string;
  gameState?: GameState;
  error?: string;
}

export class GameWebSocket {
  private ws: WebSocket | null = null;
  private listeners: Map<string, Function[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(private url: string) {}

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    this.ws = new WebSocket(this.url);
    
    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.emit('connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.emit('message', message);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.emit('disconnected');
      this.attemptReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    };
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000;
      console.log(`Reconnecting in ${delay}ms...`);
      
      setTimeout(() => {
        this.connect();
      }, delay);
    }
  }

  send(message: WebSocketMessage) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket not connected');
    }
  }

  joinGame(gameId: string, role: 'eth' | 'mon') {
    this.send({ type: 'join', gameId, role });
  }

  leaveGame(gameId: string) {
    this.send({ type: 'leave', gameId });
  }

  pour(gameId: string, amount: string) {
    this.send({ type: 'pour', gameId, amount });
  }

  on(event: string, callback: (...args: any[]) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: (...args: any[]) => void) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, ...args: any[]) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(...args));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Singleton instance
export const gameSocket = new GameWebSocket('ws://localhost:8080');
