/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useMemo, useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { useReadContract } from "wagmi";
import { useWriteContract } from "wagmi";
import { useWaitForTransactionReceipt } from "wagmi";
import { GLASSFILL_ADDRESSES, glassFillAbi } from "./abi";
import { parseEther } from "viem";
import toast from "react-hot-toast";


export function useGlassFill(gameId?: bigint) {
  const { address } = useAccount();
  const chainId = useChainId();
  const contractAddress = GLASSFILL_ADDRESSES[chainId];
  const [isSubmitting, setIsSubmitting] = useState(false);

  const gameQuery = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: glassFillAbi,
    functionName: "getGame",
    args: gameId !== undefined ? [gameId] : undefined,
    query: { enabled: gameId !== undefined },
  });

  const { writeContractAsync, data: hash } = useWriteContract();
  const tx = useWaitForTransactionReceipt({ hash });

  const createGame = useCallback(
    async (opponent: `0x${string}`, isEthPlayer: boolean) => {
      try {
        if (!contractAddress) {
          toast.error("Contract address not configured for this network");
          throw new Error("Missing contract address for chain " + chainId);
        }
        const h = await writeContractAsync({
          address: contractAddress as `0x${string}`,
          abi: glassFillAbi,
          functionName: "createGame",
          args: [opponent, isEthPlayer],
        });
        toast.loading("Creating game...", { id: h });
        return h;
      } catch (e: any) {
        toast.error(e?.shortMessage || e?.message || "Create failed");
        throw e;
      }
    },
    [writeContractAsync, contractAddress, chainId]
  );

  const joinGame = useCallback(
    async (id: bigint) => {
      try {
        if (!contractAddress) {
          toast.error("Contract address not configured for this network");
          throw new Error("Missing contract address for chain " + chainId);
        }
        const h = await writeContractAsync({
          address: contractAddress as `0x${string}`,
          abi: glassFillAbi,
          functionName: "joinGame",
          args: [id],
        });
        toast.loading("Joining game...", { id: h });
        return h;
      } catch (e: any) {
        toast.error(e?.shortMessage || e?.message || "Join failed");
        throw e;
      }
    },
    [writeContractAsync, contractAddress, chainId]
  );

  const playTurn = useCallback(
    async (id: bigint, amountEth: string) => {
      const value = parseEther(amountEth || "0");
      try {
        if (!contractAddress) {
          toast.error("Contract address not configured for this network");
          throw new Error("Missing contract address for chain " + chainId);
        }
        setIsSubmitting(true);
        const h = await writeContractAsync({
          address: contractAddress as `0x${string}`,
          abi: glassFillAbi,
          functionName: "playTurn",
          args: [id, value],
          value,
        });
        toast.loading("Submitting turn...", { id: h });
        return h;
      } catch (e: any) {
        toast.error(e?.shortMessage || e?.message || "Turn failed");
        throw e;
      } finally {
        setIsSubmitting(false);
      }
    },
    [writeContractAsync, contractAddress, chainId]
  );

  const withdraw = useCallback(
    async (id: bigint) => {
      try {
        if (!contractAddress) {
          toast.error("Contract address not configured for this network");
          throw new Error("Missing contract address for chain " + chainId);
        }
        const h = await writeContractAsync({
          address: contractAddress as `0x${string}`,
          abi: glassFillAbi,
          functionName: "withdraw",
          args: [id],
        });
        toast.loading("Withdrawing...", { id: h });
        return h;
      } catch (e: any) {
        toast.error(e?.shortMessage || e?.message || "Withdraw failed");
        throw e;
      }
    },
    [writeContractAsync, contractAddress, chainId]
  );

  const state = useMemo(() => ({
    address,
    game: gameQuery.data as any,
    refetch: gameQuery.refetch,
    isLoading: gameQuery.isLoading,
  }), [address, gameQuery.data, gameQuery.refetch, gameQuery.isLoading]);

  return {
    ...state,
    createGame,
    joinGame,
    playTurn,
    withdraw,
    tx,
    isSubmitting,
  };
}