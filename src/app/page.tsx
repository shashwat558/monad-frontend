import GameList from "../components/GameList";
import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h1 className="text-2xl font-semibold">GlassFill Lobby</h1>
        <p className="mt-2 text-white/70">Create a new game or join an existing one.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/game/new?role=eth" className="btn-primary">Create as ETH player</Link>
          <Link href="/game/new?role=mon" className="btn-primary">Create as MON player</Link>
        </div>
      </div>
      <GameList />
    </div>
  );
}
