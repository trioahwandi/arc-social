"use client";

import { useAccount, useConnect, useDisconnect, useBalance, useSwitchChain } from "wagmi";
import { injected } from "wagmi/connectors";
import { arcTestnet } from "@/lib/wagmi";
import { formatUnits } from "viem";
import { useEffect, useState } from "react";

export function ConnectWallet() {
  const { address, isConnected, chainId } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const { data: balance } = useBalance({
    address,
    chainId: arcTestnet.id,
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Auto switch ke Arc testnet kalau network salah
  useEffect(() => {
    if (isConnected && chainId !== arcTestnet.id) {
      switchChain({ chainId: arcTestnet.id });
    }
  }, [isConnected, chainId, switchChain]);

  if (!mounted) return null;

  const formattedBalance = balance
    ? parseFloat(formatUnits(balance.value, 6)).toFixed(2)
    : "0.00";

  const isWrongNetwork = isConnected && chainId !== arcTestnet.id;

  if (isConnected) {
    return (
      <div className="flex items-center gap-3">
        {isWrongNetwork ? (
          <button
            onClick={() => switchChain({ chainId: arcTestnet.id })}
            className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-2 text-red-600 font-semibold text-sm hover:bg-red-100 transition"
          >
            ⚠️ Switch to Arc Testnet
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2">
            <span className="text-blue-700 font-semibold text-sm">
              💵 {formattedBalance} USDC
            </span>
          </div>
        )}
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
          Disconnect
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