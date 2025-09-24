import Link from "next/link";

export interface GameSummary {
  id: bigint;
  ethPlayer: `0x${string}`;
  monPlayer: `0x${string}`;
  current: bigint;
  limit: bigint;
  status: "WAITING" | "IN_PROGRESS" | "FINISHED";
}

export default function GameCard({ game }: { game: GameSummary }) {
  // Avoid using BigInt literals for compatibility with lower than ES2020
  const progress = Number((game.current * BigInt(100)) / game.limit);
  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Game #{game.id.toString()}</h3>
        <span
          className={
            game.status === "FINISHED"
              ? "text-emerald-400"
              : game.status === "IN_PROGRESS"
              ? "text-yellow-400"
              : "text-sky-400"
          }
        >
          {game.status}
        </span>
      </div>
      <div className="mt-2 text-sm text-white/70">
        <div>ETH player: {short(game.ethPlayer)}</div>
        <div>MON player: {short(game.monPlayer)}</div>
      </div>
      <div className="mt-3">
        <div className="h-2 w-full overflow-hidden rounded bg-white/10">
          <div
            className="h-2 bg-indigo-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-1 text-xs text-white/60">
          {formatEther(game.current)} / {formatEther(game.limit)}
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Link href={`/game/${game.id.toString()}`} className="btn-primary">
          Open
        </Link>
      </div>
    </div>
  );
}

function short(a: string) {
  return `${a.slice(0, 6)}...${a.slice(-4)}`;
}

function formatEther(v: bigint) {
  // simple formatter assuming 18 decimals
  const s = (Number(v) / 1e18).toFixed(4);
  return `${s}`;
}



