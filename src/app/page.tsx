"use client";

import { useState } from "react";
import GlassUI from "../components/GlassUI";
import MultiplayerGlassUI from "../components/MultiplayerGlassUI";

export default function Home() {
  const [gameMode, setGameMode] = useState<'single' | 'multiplayer'>('single');
  const [gameId, setGameId] = useState("1");

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h1 className="text-2xl font-semibold">Make Me Wet Game</h1>
        <p className="mt-2 text-white/70">Choose your game mode</p>
        
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => setGameMode('single')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              gameMode === 'single' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Single Player
          </button>
          <button
            onClick={() => setGameMode('multiplayer')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              gameMode === 'multiplayer' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Multiplayer
          </button>
        </div>

        {gameMode === 'multiplayer' && (
          <div className="mt-4">
            <label className="block text-sm text-white/70 mb-2">Game ID</label>
            <input
              type="text"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              placeholder="Enter game ID"
              className="input w-48"
            />
          </div>
        )}
      </div>

      {gameMode === 'single' ? (
        <GlassUI gameId={1n} />
      ) : (
        <MultiplayerGlassUI gameId={gameId} />
      )}
    </div>
  );
}

function parseEther(value: string): bigint {
  return BigInt(Math.floor(parseFloat(value) * 1e18));
}
