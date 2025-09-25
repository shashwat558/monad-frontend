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
    // Use an explicit public RPC URL to avoid CORS or provider key issues in the browser
    [sepolia.id]: http("https://rpc.ankr.com/eth_sepolia"),
    [monadTestnet.id]: http("https://testnet-rpc.monad.xyz"),
  },
  ssr: true,
});


