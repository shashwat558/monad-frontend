"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useGlassFill } from "../../../hooks/useGlassFill";
import { usePublicClient } from "wagmi";
import { decodeEventLog, Hex, parseAbiItem } from "viem";
import { glassFillAbi, GLASSFILL_ADDRESS } from "../../../hooks/abi";
import { useRouter } from "next/navigation";
import { useSwitchChain } from "wagmi";
import { sepolia, monadTestnet } from "wagmi/chains";

export default function NewGamePage() {
  const params = useSearchParams();
  const role = params.get("role") || "eth";
  const [opponent, setOpponent] = useState("");
  const { createGame } = useGlassFill();
  const client = usePublicClient();
  const router = useRouter();
  const { switchChainAsync } = useSwitchChain();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="glass-card p-6 space-y-4">
      <h1 className="text-xl font-semibold">Create New Game</h1>
      <div className="text-white/70">You are creating as: <span className="font-semibold">{role.toUpperCase()}</span> player</div>
      <div>
        <label className="mb-1 block text-sm text-white/70">Opponent address</label>
        <input className="input" placeholder="0x..." value={opponent} onChange={(e) => setOpponent(e.target.value)} />
      </div>
      {error && <div className="text-red-500">{error}</div>}
      <button
        className="btn-primary"
        onClick={async () => {
          try {
            if (!opponent || !opponent.startsWith("0x") || opponent.length !== 42) return;
            // Ensure correct network based on role
            await switchChainAsync({ chainId: role === "eth" ? sepolia.id : monadTestnet.id });
            const hash = await createGame(opponent as `0x${string}`, role === "eth");
            if (!client) return;
            const receipt = await client.waitForTransactionReceipt({ hash: hash as Hex });
            // Robustly fetch GameCreated from chain logs on that block
            const logs = await client.getLogs({
              address: GLASSFILL_ADDRESS,
              fromBlock: receipt.blockNumber,
              toBlock: receipt.blockNumber,
            });
            for (const log of logs) {
              try {
                const ev = decodeEventLog({
                  abi: [
                    parseAbiItem(
                      "event GameCreated(uint256 gameId, address creator, address opponent, bool isEthPlayer)"
                    ),
                  ],
                  data: log.data,
                  topics: log.topics,
                });
                if (ev.eventName === "GameCreated") {
                  const gameId = ev.args.gameId as bigint;
                  router.push(`/game/${gameId.toString()}`);
                  setError(null);
                  return;
                }
              } catch {}
            }
            // Fallback: try inline decode of all receipt logs with typed item
            for (const log of receipt.logs) {
              try {
                const ev = decodeEventLog({
                  abi: [
                    parseAbiItem(
                      "event GameCreated(uint256 gameId, address creator, address opponent, bool isEthPlayer)"
                    ),
                  ],
                  data: log.data,
                  topics: log.topics,
                });
                if (ev.eventName === "GameCreated") {
                  const gameId = ev.args.gameId as bigint;
                  router.push(`/game/${gameId.toString()}`);
                  setError(null);
                  return;
                }
              } catch {}
            }
          } catch (e) {
            // swallow error to avoid hanging UI; user will see wallet error
            setError(e instanceof Error ? e.message : "Unknown error occurred");
          }
        }}
      >
        Create Game
      </button>
    </div>
  );
}


