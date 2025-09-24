"use client";

import { ReactNode, useMemo } from "react";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { wagmiConfig, queryClient } from "./wagmi";

// wagmiConfig and queryClient are singletons imported from ./wagmi



export default function Providers({ children }: { children: ReactNode }) {
  const theme = useMemo(
    () =>
      darkTheme({
        accentColor: "#4f46e5",
        borderRadius: "large",
      }),
    []
  );

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={theme}>
          <Toaster position="top-right" />
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}



