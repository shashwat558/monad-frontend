"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { sepolia, monadTestnet } from "wagmi/chains";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export const wagmiConfig = getDefaultConfig({
  appName: "GlassFill",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "dev",
  chains: [sepolia, monadTestnet],
  transports: {
    [sepolia.id]: http(),
    [monadTestnet.id]: http("https://testnet-rpc.monad.xyz"),
  },
  ssr: true,
});


