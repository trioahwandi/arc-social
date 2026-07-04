import { createConfig, http } from "wagmi";
import { defineChain } from "viem";

export const arcTestnet = defineChain({
  id: 5042002,
  name: "Arc Testnet",
  nativeCurrency: {
    name: "USD Coin",
    symbol: "USDC",
    decimals: 18, // MetaMask butuh 18, konversi kita handle manual
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

export const CONTRACT_ADDRESSES = {
  ProfileRegistry: "0x409c35d67ed0EbA2670139df0662854692649d00",
  FeedContract: "0x27611Ac740e840eb428fbDf9136C5132c1446A22",
  TipContract: "0x91E563C6ffa58005ed134c2f8E2bBCa032533dC1",
} as const;

export const config = createConfig({
  chains: [arcTestnet],
  transports: {
    [arcTestnet.id]: http("https://arc-testnet.drpc.org"),
  },
});