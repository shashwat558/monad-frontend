"use client";

import { useState } from "react";
import { useMultiplayerGame } from "../hooks/useMultiplayerGame";

interface MultiplayerGlassUIProps {
  gameId: string;
}

export default function MultiplayerGlassUI({ gameId }: MultiplayerGlassUIProps) {
  const {
    gameState,
    isConnected,
    error,
    myRole,
    isMyTurn,
    joinAsEth,
    joinAsMon,
    pour,
    leaveGame,
  } = useMultiplayerGame(gameId);

  const [amount, setAmount] = useState("0.1");

  if (!isConnected) {
    return (
      <div className="glass-card p-6 text-center">
        <div className="text-red-400 mb-4">Connecting to game server...</div>
        <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white rounded-full mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-6 text-center">
        <div className="text-red-400 mb-4">Error: {error}</div>
        <button onClick={() => window.location.reload()} className="btn-primary">
          Retry
        </button>
      </div>
    );
  }

  // Waiting for role selection
  if (!myRole) {
    return (
      <div className="glass-card p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Join Game #{gameId}</h2>
          <p className="text-white/70 mb-6">Choose your role:</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={joinAsEth}
            className="glass-card p-6 text-center hover:bg-white/10 transition-colors"
          >
            <div className="text-2xl mb-2">🟡</div>
            <div className="font-semibold text-cyan-400">ETH Player</div>
            <div className="text-sm text-white/60 mt-1">
              Pour ETH into the glass
            </div>
          </button>
          
          <button
            onClick={joinAsMon}
            className="glass-card p-6 text-center hover:bg-white/10 transition-colors"
          >
            <div className="text-2xl mb-2">🟣</div>
            <div className="font-semibold text-purple-400">MON Player</div>
            <div className="text-sm text-white/60 mt-1">
              Pour MON into the glass
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Waiting for opponent
  if (!gameState || !gameState.players.eth || !gameState.players.mon) {
    return (
      <div className="glass-card p-6 text-center space-y-4">
        <div className="text-lg font-semibold">
          Waiting for {myRole === 'eth' ? 'MON' : 'ETH'} player...
        </div>
        <div className="text-white/60">
          You are the {myRole.toUpperCase()} player
        </div>
        <button onClick={leaveGame} className="btn-primary bg-red-600 hover:bg-red-500">
          Leave Game
        </button>
      </div>
    );
  }

  // Game in progress
  const currentAmount = BigInt(gameState.currentAmount);
  const progress = Number((currentAmount * 100n) / parseEther("1"));
  const isFull = currentAmount >= parseEther("1");
  const maxPour = parseEther("1") - currentAmount;

  return (
    <div className="glass-card p-6 space-y-6">
      {/* Game Info */}
      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold">Game #{gameId}</div>
        <div className="flex gap-2">
          <div className={`px-3 py-1 rounded-full text-sm ${
            myRole === 'eth' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-purple-500/20 text-purple-400'
          }`}>
            You: {myRole.toUpperCase()}
          </div>
          <button onClick={leaveGame} className="text-red-400 hover:text-red-300 text-sm">
            Leave
          </button>
        </div>
      </div>

      {/* Glass Visual */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="w-32 h-48 border-4 border-white/20 rounded-b-3xl overflow-hidden bg-gradient-to-b from-blue-900/20 to-blue-800/20">
            <div 
              className="absolute bottom-0 w-full bg-gradient-to-t from-indigo-500 to-cyan-400 transition-all duration-500 ease-out"
              style={{ height: `${Math.min(progress, 100)}%` }}
            />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-pulse" />
              <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white/40 rounded-full animate-pulse delay-300" />
            </div>
          </div>
          <div className="absolute -top-1 left-0 right-0 h-2 bg-white/30 rounded-t-full" />
        </div>
      </div>

      {/* Progress Info */}
      <div className="text-center space-y-2">
        <div className="text-2xl font-bold text-white">
          {formatEther(currentAmount)} 
        </div>
        <div className="text-sm text-white/60">
          {progress.toFixed(1)}% full
        </div>
        {isFull && (
          <div className="text-red-400 font-semibold animate-pulse">
            ⚠️ GLASS OVERFLOW! ⚠️
          </div>
        )}
      </div>

      {/* Pot Contents */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 text-center">
          <div className="text-sm text-white/60 mb-1">ETH in Pot</div>
          <div className="text-lg font-semibold text-cyan-400">
            {formatEther(BigInt(gameState.ethAmount))} ETH
          </div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-sm text-white/60 mb-1">MON in Pot</div>
          <div className="text-lg font-semibold text-purple-400">
            {formatEther(BigInt(gameState.monAmount))} MON
          </div>
        </div>
      </div>

      {/* Turn Indicator */}
      <div className="text-center">
        <div className={`text-lg font-semibold ${
          gameState.isEthTurn ? 'text-cyan-400' : 'text-purple-400'
        }`}>
          {gameState.isEthTurn ? 'ETH' : 'MON'} Player's Turn
        </div>
        <div className="text-sm text-white/60">
          {isMyTurn ? "It's your turn!" : "Waiting for opponent..."}
        </div>
      </div>

      {/* Pour Controls */}
      {!gameState.isGameOver && (
        <div className="space-y-4">
          <div className="flex gap-3">
            <input
              type="number"
              step="0.01"
              min="0"
              max={formatEther(maxPour)}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount to pour"
              className="input flex-1"
              disabled={!isMyTurn}
            />
            <button
              onClick={() => {
                pour(amount);
                setAmount("0.1");
              }}
              disabled={!isMyTurn || !amount || parseFloat(amount) <= 0}
              className="btn-primary px-6"
            >
              Pour
            </button>
          </div>
          
          <div className="text-xs text-white/50 text-center">
            Max: {formatEther(maxPour)} (prevents overflow)
          </div>
        </div>
      )}

      {/* Game Over State */}
      {gameState.isGameOver && (
        <div className="text-center space-y-4">
          <div className="text-xl font-bold text-red-400">
            Game Over!
          </div>
          <div className="text-white/70">
            {gameState.winner === myRole ? "You won!" : "You lost!"}
          </div>
          <div className="text-sm text-white/60">
            Total ETH: {formatEther(BigInt(gameState.ethAmount))} | Total MON: {formatEther(BigInt(gameState.monAmount))}
          </div>
          <button className="btn-primary">
            Withdraw Winnings
          </button>
        </div>
      )}
    </div>
  );
}

function formatEther(value: bigint): string {
  return (Number(value) / 1e18).toFixed(4);
}

function parseEther(value: string): bigint {
  return BigInt(Math.floor(parseFloat(value) * 1e18));
}
