"use client";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { createConfig, WagmiConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import React, { useState, useEffect } from "react";

import { NextUIProvider } from "@nextui-org/react";

const config = createConfig(
  getDefaultConfig({
    appName: "portfolio project frontend",
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID,
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    chains: [sepolia],
  })
);

export function Providers({ children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider theme="rounded">
        <NextUIProvider>{mounted && children}</NextUIProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}
