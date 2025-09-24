"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-black/30 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-600" />
          <span className="text-lg font-semibold">GlassFill</span>
        </Link>
        <ConnectButton showBalance={false} chainStatus="none" />
      </div>
    </header>
  );
}



