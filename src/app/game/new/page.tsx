"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useGlassFill } from "../../../hooks/useGlassFill";
import { usePublicClient } from "wagmi";
import { decodeEventLog, Hex, parseAbiItem } from "viem";
import { glassFillAbi, GLASSFILL_ADDRESSES } from "../../../hooks/abi";
import { useRouter } from "next/navigation";
import { useSwitchChain } from "wagmi";
import { sepolia, monadTestnet } from "wagmi/chains";

export default function NewGamePage() {
  const params = useSearchParams();
  const role = params.get("role") || "eth";
  const [opponent, setOpponent] = useState("");
  const { createGame } = useGlassFill();
  const router = useRouter();
  const { switchChainAsync } = useSwitchChain();
  const [error, setError] = useState<string | null>(null);
  // Resolve target chain/address by role (ETH => Sepolia, MON => Monad Testnet)
  const targetChainId = role === "eth" ? sepolia.id : monadTestnet.id;
  const targetAddress = GLASSFILL_ADDRESSES[targetChainId];
  const client = usePublicClient({ chainId: targetChainId });
  console.log("Using contract", targetAddress, "on chain", targetChainId);



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
            await switchChainAsync({ chainId: targetChainId });
            const hash = await createGame(opponent as `0x${string}`, role === "eth");
            if (!client || !targetAddress) {
              setError("Missing client or contract address for target chain.");
              return;
            }
            const receipt = await client.waitForTransactionReceipt({ hash: hash as Hex });
            // 1) Decode only logs from our contract in this receipt
            for (const log of receipt.logs) {
              if (String(log.address).toLowerCase() !== String(targetAddress).toLowerCase()) continue;
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

            // 2) Fallback: scan a short window of logs for our contract
            const fromBlock = receipt.blockNumber > 64n ? (receipt.blockNumber - 64n) : receipt.blockNumber;
            const logs = await client.getLogs({ address: targetAddress as `0x${string}`, fromBlock, toBlock: receipt.blockNumber });
            for (const log of logs.reverse()) {
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
            setError("Game created but event not found. Check address/signature or refresh lobby.");
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


