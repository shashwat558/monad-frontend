"use client";

import { useEffect, useState } from "react";
import GameCard, { GameSummary } from "./GameCard";
import Link from "next/link";

export default function GameList() {
  const [games, setGames] = useState<GameSummary[]>([]);

  useEffect(() => {
    // Placeholder: In production, read from contract event logs or view
    setGames([]);
  }, []);

  return (
    <div className="space-y-4">
      <div className="glass-card p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Active Games</h2>
          <Link href="/" />
        </div>
        {games.length === 0 ? (
          <div className="py-6 text-center text-white/60">No active games yet.</div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {games.map((g) => (
              <GameCard key={g.id.toString()} game={g} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}



