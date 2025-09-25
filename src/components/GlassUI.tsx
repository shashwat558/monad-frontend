"use client";

import { useState } from "react";

interface GlassUIProps {
  gameId?: bigint;
}

export default function GlassUI({ gameId = 1n }: GlassUIProps) {
  const [currentAmount, setCurrentAmount] = useState(parseEther("0.3"));
  const [ethAmount, setEthAmount] = useState(parseEther("0.2"));
  const [monAmount, setMonAmount] = useState(parseEther("0.1"));
  const [isYourTurn, setIsYourTurn] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [amount, setAmount] = useState("0.1");
  
  const limit = parseEther("1");
  const progress = Number((currentAmount * 100n) / limit);
  const isFull = currentAmount >= limit;
  const maxPour = limit - currentAmount;

  // Pouring logic
  const handlePour = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    const pourAmount = parseEther(amount);
    const newTotal = currentAmount + pourAmount;
    
    // Check for overflow
    if (newTotal > limit) {
      // Game over - overflow!
      setIsGameOver(true);
      setWinner("Opponent"); // The one who caused overflow loses
      setCurrentAmount(limit); // Fill to the brim
    } else {
      // Normal pour
      setCurrentAmount(newTotal);
      
      // Add to appropriate pot (simulate ETH vs MON player)
      if (isYourTurn) {
        setEthAmount(ethAmount + pourAmount);
      } else {
        setMonAmount(monAmount + pourAmount);
      }
      
      // Check if glass is exactly full (game over)
      if (newTotal === limit) {
        setIsGameOver(true);
        setWinner("You"); // You filled it exactly, you win
      } else {
        // Switch turns
        setIsYourTurn(!isYourTurn);
      }
    }
    
    setAmount("0.1"); // Reset input
  };

  // Reset game
  const resetGame = () => {
    setCurrentAmount(parseEther("0"));
    setEthAmount(parseEther("0"));
    setMonAmount(parseEther("0"));
    setIsYourTurn(true);
    setIsGameOver(false);
    setWinner(null);
    setAmount("0.1");
  };

  return (
    <div className="glass-card p-6 space-y-6">
      {/* Glass Visual */}
      <div className="flex justify-center">
        <div className="relative">
          {/* Glass Container */}
          <div className="w-32 h-48 border-4 border-white/20 rounded-b-3xl overflow-hidden bg-gradient-to-b from-blue-900/20 to-blue-800/20">
            {/* Liquid Level */}
            <div 
              className="absolute bottom-0 w-full bg-gradient-to-t from-indigo-500 to-cyan-400 transition-all duration-500 ease-out"
              style={{ height: `${Math.min(progress, 100)}%` }}
            />
            {/* Bubbles */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-pulse" />
              <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white/40 rounded-full animate-pulse delay-300" />
              <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse delay-700" />
            </div>
          </div>
          
          {/* Glass Rim */}
          <div className="absolute -top-1 left-0 right-0 h-2 bg-white/30 rounded-t-full" />
        </div>
      </div>

      {/* Progress Info */}
      <div className="text-center space-y-2">
        <div className="text-2xl font-bold text-white">
          {formatEther(currentAmount)}
        </div>
        {/* <div className="text-sm text-white/60">
          {progress.toFixed(1)}% full
        </div> */}
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
            {formatEther(ethAmount)} ETH
          </div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-sm text-white/60 mb-1">MON in Pot</div>
          <div className="text-lg font-semibold text-purple-400">
            {formatEther(monAmount)} MON
          </div>
        </div>
      </div>

      {/* Pour Controls */}
      {!isGameOver && (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-sm text-white/70 mb-2">
              {isYourTurn ? "Your turn to pour" : "Waiting for opponent..."}
            </div>
            <div className="text-xs text-white/50">
              Game #{gameId.toString()}
            </div>
          </div>
          
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
              disabled={!isYourTurn}
            />
            <button
              onClick={handlePour}
              disabled={!isYourTurn || !amount || parseFloat(amount) <= 0}
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
      {isGameOver && (
        <div className="text-center space-y-4">
          <div className="text-xl font-bold text-red-400">
            Game Over!
          </div>
          <div className="text-white/70">
            {winner === "You" ? "You won! Glass filled exactly.💦💦" : "You lost! Glass overflowed.💦💦"}
          </div>
          <div className="text-sm text-white/60">
            Total ETH: {formatEther(ethAmount)} | Total MON: {formatEther(monAmount)}
          </div>
          <div className="flex gap-3 justify-center">
            <button className="btn-primary">
              Withdraw Winnings
            </button>
            <button 
              onClick={resetGame}
              className="btn-primary bg-gray-600 hover:bg-gray-500"
            >
              New Game
            </button>
          </div>
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
