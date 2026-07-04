"use client";

import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi";
import { injected } from "wagmi/connectors";
import { arcTestnet } from "@/lib/wagmi";
import { formatUnits } from "viem";
import { useEffect, useState } from "react";

export function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({
    address,
    chainId: arcTestnet.id,
  });

  // Fix hydration error
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  // Format balance USDC — 6 desimal
  const formattedBalance = balance
    ? parseFloat(formatUnits(balance.value, 6)).toFixed(2)
    : "0.00";

  if (isConnected) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2">
          <span className="text-blue-700 font-semibold text-sm">
            💵 {formattedBalance} USDC
          </span>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-sm font-medium text-gray-700">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
        </div>
        <button
          onClick={() => disconnect()}
          className="text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded-full px-4 py-2 transition"
        >
          Keluar
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: injected(), chainId: arcTestnet.id })}
      className="bg-blue-900 hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded-full transition"
    >
      Connect Wallet
    </button>
  );
}