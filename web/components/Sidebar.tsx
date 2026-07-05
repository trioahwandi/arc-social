"use client";

import { useAccount } from "wagmi";
import { ConnectWallet } from "./ConnectWallet";

const navItems = [
  { label: "Home", href: "/", badge: 0 },
  { label: "Search", href: "/search", badge: 0 },
  { label: "Notifications", href: "/notifications", badge: 2 },
  { label: "Wallet", href: "/wallet", badge: 0 },
  { label: "Profile", href: "/profile", badge: 0 },
  { label: "Leaderboard", href: "/leaderboard", badge: 0 },
  { label: "Settings", href: "/settings", badge: 0 },
];

export function Sidebar() {
  const { address, isConnected } = useAccount();
  const short = address ? address.slice(0, 6) + "..." + address.slice(-4) : "";
  const av = address ? address.slice(2, 4).toUpperCase() : "??";

  return (
    <aside className="w-60 shrink-0 sticky top-0 h-screen flex flex-col px-3 py-5 border-r border-blue-100 bg-white">
      <div className="flex items-center gap-3 px-3 mb-6">
        <div className="w-9 h-9 rounded-lg bg-blue-900 flex items-center justify-center text-white font-bold text-sm">A</div>
        <span className="font-bold text-blue-900 text-lg">Arciden</span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => (
          <a key={item.label} href={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-blue-50 hover:text-blue-900 transition font-medium text-sm">
            <span>{item.label}</span>
            {item.badge && <span className="ml-auto bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{item.badge}</span>}
          </a>
        ))}
      </nav>

      {isConnected && (
        <div className="px-3 py-2 rounded-xl hover:bg-blue-50 transition cursor-pointer mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold text-sm">{av}</div>
            <div>
              <div className="text-sm font-semibold text-gray-900">{short}</div>
              <div className="text-xs text-gray-400">Arc Testnet</div>
            </div>
          </div>
        </div>
      )}

      {isConnected ? (
        <button className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 rounded-full transition text-sm">Create Post</button>
      ) : (
        <ConnectWallet />
      )}
    </aside>
  );
}