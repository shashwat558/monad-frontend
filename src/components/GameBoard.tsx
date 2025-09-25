"use client";

import { useState, useMemo } from "react";
import { useGlassFill } from "../hooks/useGlassFill";
import toast from "react-hot-toast";

export default function GameBoard({ gameId }: { gameId: bigint }) {
  const { game, isLoading, playTurn, withdraw, isSubmitting, tx } = useGlassFill(gameId);
  const [amount, setAmount] = useState("0.1");

  const progress = useMemo(() => {
    if (!game) return 0;
    const current = Number(game.currentAmount ?? 0);
    const limit = Number(game.limit ?? 1);
    if (limit === 0) return 0;
    return Math.floor((current * 100) / limit);
  }, [game]);

  if (isLoading) {
    return <div className="glass-card p-6">Loading game...</div>;
  }
  if (!game) {
    return <div className="glass-card p-6">Game not found.</div>;
  }

  const statusLabel = ["WAITING", "IN_PROGRESS", "FINISHED"][Number(game.status || 0)];

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Game #{String(gameId)}</h2>
        <span className="text-white/60">{statusLabel}</span>
      </div>

      <div>
        <div className="h-3 w-full overflow-hidden rounded bg-white/10">
          <div className="h-3 bg-indigo-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-1 text-sm text-white/60">
          {fmt(game.currentAmount)} / {fmt(game.limit)}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="glass-card p-4">
          <div className="text-sm text-white/60">ETH in pot</div>
          <div className="text-lg font-semibold">{fmt(game.ethInPot)}</div>
        </div>
        <div className="glass-card p-4">
          <div className="text-sm text-white/60">MON in pot</div>
          <div className="text-lg font-semibold">{fmt(game.monInPot)}</div>
        </div>
      </div>

      {statusLabel !== "FINISHED" ? (
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="mb-1 block text-sm text-white/70">Amount</label>
            <input className="input" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <div className="mt-1 text-xs text-white/50">Prevent overflow: keep total ≤ limit</div>
          </div>
          <button
            className="btn-primary"
            disabled={isSubmitting}
            onClick={async () => {
              try {
                const hash = await playTurn(gameId, amount);
                toast.success("Transaction submitted: " + String(hash).slice(0, 10) + "...");
              } catch (e) {
                // error toasts handled in hook
              }
            }}
          >
            Pour
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <div className="text-white/70">Game over.</div>
          <button
            className="btn-primary"
            disabled={isSubmitting}
            onClick={async () => {
              try {
                const hash = await withdraw(gameId);
                toast.success("Withdraw submitted: " + String(hash).slice(0, 10) + "...");
              } catch (e) {}
            }}
          >
            Withdraw ETH
          </button>
        </div>
      )}
    </div>
  );
}

function fmt(v?: bigint | string) {
  const n = typeof v === "string" ? BigInt(v) : BigInt(v || 0);
  return (Number(n) / 1e18).toFixed(4);
}

