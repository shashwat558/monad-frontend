"use client";

import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";

// Paste your ABI here (as JS object, not string)
export const CONTRACT_ABI = [
  { "inputs": [ { "internalType": "address", "name": "_player1", "type": "address" }, { "internalType": "address", "name": "_player2", "type": "address" }, { "internalType": "uint256", "name": "_betAmount", "type": "uint256" } ], "stateMutability": "nonpayable", "type": "constructor" },
  { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" },
  { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "winner", "type": "address" }, { "indexed": false, "internalType": "address", "name": "loser", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "GameResult", "type": "event" },
  { "inputs": [], "name": "gameMode", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "betAmount", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "player1", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "player2", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "isGameReady", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "hasStarted", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "winner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "joinGame", "outputs": [], "stateMutability": "payable", "type": "function" },
  { "inputs": [], "name": "startGame", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [], "name": "endGame", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [ { "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
] as const;

export const CONTRACT_ADDRESS = "0x730d9b33b51e80c84b6be020fe5b71103cb3fa62" as const;

export type GameState = {
  player1: string;
  player2: string;
  betAmount: string;
  isReady: boolean;
  hasStarted: boolean;
  winner: string;
  gameMode: string;
};

export function useTwoPlayerGame() {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      const ethProvider = new ethers.providers.Web3Provider((window as any).ethereum);
      setProvider(ethProvider);
      const s = ethProvider.getSigner();
      setSigner(s);
      setContract(new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, s));
    }
  }, []);

  const getGameState = useCallback(async (): Promise<GameState | null> => {
    if (!contract) return null;
    const [player1, player2, betAmount, isReady, hasStarted, winner, gameMode] = await Promise.all([
      contract.player1(),
      contract.player2(),
      contract.betAmount(),
      contract.isGameReady(),
      contract.hasStarted(),
      contract.winner(),
      contract.gameMode(),
    ]);
    return {
      player1,
      player2,
      betAmount: betAmount.toString(),
      isReady,
      hasStarted,
      winner,
      gameMode,
    };
  }, [contract]);

  const joinGame = useCallback(
    async (valueEth: string) => {
      if (!contract) throw new Error("Contract not initialized");
      const tx = await contract.joinGame({ value: ethers.utils.parseEther(valueEth) });
      return tx.wait();
    },
    [contract]
  );

  const startGame = useCallback(async () => {
    if (!contract) throw new Error("Contract not initialized");
    const tx = await contract.startGame();
    return tx.wait();
  }, [contract]);

  const endGame = useCallback(async () => {
    if (!contract) throw new Error("Contract not initialized");
    const tx = await contract.endGame();
    return tx.wait();
  }, [contract]);

  return { provider, signer, contract, getGameState, joinGame, startGame, endGame };
}
