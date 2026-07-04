import { createConfig, http } from "wagmi";
import { defineChain } from "viem";

// Definisi Arc Testnet
export const arcTestnet = defineChain({
  id: 5042002,
  name: "Arc Testnet",
  nativeCurrency: {
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
  },
  rpcUrls: {
    default: {
      http: ["https://arc-testnet.drpc.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "ArcScan",
      url: "https://testnet.arcscan.app",
    },
  },
  testnet: true,
});

// Contract addresses dari deployed-addresses.json
export const CONTRACT_ADDRESSES = {
  ProfileRegistry: "0x409c35d67ed0EbA2670139df0662854692649d00",
  FeedContract: "0x27611Ac740e840eb428fbDf9136C5132c1446A22",
  TipContract: "0x91E563C6ffa58005ed134c2f8E2bBCa032533dC1",
} as const;

// Wagmi config
export const config = createConfig({
  chains: [arcTestnet],
  transports: {
    [arcTestnet.id]: http(),
  },
});