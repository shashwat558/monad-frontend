import GameBoard from "../../../components/GameBoard";

export default function GamePage({ params }: { params: { id: string } }) {
  const id = BigInt(params.id);
  return <GameBoard gameId={id} />;
}

"use client";

import { useParams, useRouter } from "next/navigation";
import Navbar from "@/src/components/Navbar";
import GameBoard from "@/src/components/GameBoard";
import { useGlassFill } from "@/src/hooks/useGlassFill";
import toast from "react-hot-toast";

export default function GamePage() {
  const params = useParams();
  const idParam = params?.id as string;
  const gameId = BigInt(idParam);

  const { current, limit, isEthPlayer, yourTurn, playTurn, withdraw, winner } =
    useGlassFill(gameId);

  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-6">
        <GameBoard
          gameId={gameId}
          isEthPlayer={isEthPlayer}
          current={current}
          limit={limit}
          yourTurn={yourTurn}
          onPlay={async (a) => {
            const hash = await playTurn(a);
            toast.success("Transaction submitted: " + hash.slice(0, 10) + "...");
          }}
          onWithdraw={async () => {
            const hash = await withdraw(gameId);
            toast.success("Withdraw submitted: " + hash.slice(0, 10) + "...");
          }}
          winner={winner || undefined}
        />
      </main>
    </div>
  );
}


