"use client";

import { useState, useEffect, useCallback } from "react";
import { gameSocket, GameState, WebSocketMessage } from "../lib/websocket";

export function useMultiplayerGame(gameId: string) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [myRole, setMyRole] = useState<'eth' | 'mon' | null>(null);
  const [isMyTurn, setIsMyTurn] = useState(false);

  useEffect(() => {
    const handleConnected = () => setIsConnected(true);
    const handleDisconnected = () => setIsConnected(false);
    const handleMessage = (message: WebSocketMessage) => {
      if (message.type === 'gameState' && message.gameState) {
        setGameState(message.gameState);
        setIsMyTurn(
          myRole === 'eth' ? message.gameState.isEthTurn : !message.gameState.isEthTurn
        );
      } else if (message.type === 'error') {
        setError(message.error || 'Unknown error');
      }
    };

    gameSocket.on('connected', handleConnected);
    gameSocket.on('disconnected', handleDisconnected);
    gameSocket.on('message', handleMessage);

    gameSocket.connect();

    return () => {
      gameSocket.off('connected', handleConnected);
      gameSocket.off('disconnected', handleDisconnected);
      gameSocket.off('message', handleMessage);
    };
  }, [myRole]);

  const joinAsEth = useCallback(() => {
    setMyRole('eth');
    gameSocket.joinGame(gameId, 'eth');
  }, [gameId]);

  const joinAsMon = useCallback(() => {
    setMyRole('mon');
    gameSocket.joinGame(gameId, 'mon');
  }, [gameId]);

  const pour = useCallback((amount: string) => {
    if (isMyTurn && gameState && !gameState.isGameOver) {
      gameSocket.pour(gameId, amount);
    }
  }, [gameId, isMyTurn, gameState]);

  const leaveGame = useCallback(() => {
    gameSocket.leaveGame(gameId);
    setMyRole(null);
    setGameState(null);
  }, [gameId]);

  return {
    gameState,
    isConnected,
    error,
    myRole,
    isMyTurn,
    joinAsEth,
    joinAsMon,
    pour,
    leaveGame,
  };
}
